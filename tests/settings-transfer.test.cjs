const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const source = readFileSync(path.join(__dirname, '..', 'SpeakiMod.js'), 'utf8');
// Exercise the actual button handlers without starting Electron, contacting the
// game, or reading real account data. The mod is a single injected script.
const allowlistStart = source.indexOf('const SPKMOD_SETTINGS_KEYS =');
const allowlistEnd = source.indexOf('function toggleSettingsModal()', allowlistStart);
const buttonsStart = source.indexOf('lunPanelElements.exportSettingsBtn =');
const buttonsEnd = source.indexOf('\n\t\t]),', buttonsStart);
assert.ok(allowlistStart >= 0 && allowlistEnd > allowlistStart);
assert.ok(buttonsStart >= 0 && buttonsEnd > buttonsStart);

function createHarness(initial = {}) {
	const storage = { ...initial };
	Object.defineProperties(storage, {
		getItem: { value: key => Object.hasOwn(storage, key) ? storage[key] : null },
		setItem: { value: (key, value) => { storage[key] = String(value); } }
	});
	const buttons = {};
	const alerts = [];
	let exportedBlob;
	let download;
	let fileInput;
	let reloadCount = 0;
	const context = vm.createContext({
		localStorage: storage,
		lunPanelElements: buttons,
		buildElement: (_tag, props) => props,
		t: key => key,
		Blob,
		URL: {
			createObjectURL(blob) { exportedBlob = blob; return 'blob:settings-test'; },
			revokeObjectURL() {}
		},
		document: {
			createElement(tag) {
				const element = { click() {} };
				if (tag === 'a') download = element;
				if (tag === 'input') fileInput = element;
				return element;
			}
		},
		FileReader: class {
			readAsText(file) { this.onload({ target: { result: file.text } }); }
		},
		alert: message => alerts.push(message),
		location: { reload() { reloadCount++; } }
	});
	vm.runInContext(source.slice(allowlistStart, allowlistEnd), context);
	vm.runInContext(`[${source.slice(buttonsStart, buttonsEnd)}]`, context);
	return {
		storage,
		alerts,
		get reloadCount() { return reloadCount; },
		async exportSettings() {
			buttons.exportSettingsBtn.onclick();
			assert.equal(download.download, 'speakimod_settings.json');
			return JSON.parse(await exportedBlob.text());
		},
		importSettings(text) {
			buttons.importSettingsBtn.onclick();
			fileInput.onchange({ target: { files: [{ text }] } });
		}
	};
}

const preferences = {
	'spkmod-lang': 'zh',
	'spkmod-ui-scale': '0.85',
	'spkmod-uiscale': '1.1',
	'spkmod-translate-enabled': 'false',
	'spkmod-accent-color': '#ffd54a',
	'spkmod-gamepad-config': JSON.stringify({ attack: 0 }),
	'spkmod-pos-spkmod-hud': JSON.stringify({ top: '10px', left: '20px' })
};
const privateData = {
	'spkmod-saved-accounts': JSON.stringify([{ nickname: 'Test', code: 'FAKE-RECOVERY-CODE' }]),
	'spkmod-translate-email': 'test@example.invalid',
	'spkmod-translations-cache': '{"en":{}}',
	'spkmod-future-secret': 'fake future credential',
	'game-auth-token': 'fake game token'
};

test('export contains preferences only, excluding accounts and unknown keys', async () => {
	const harness = createHarness({ ...preferences, ...privateData });
	assert.deepEqual(await harness.exportSettings(), preferences);
	assert.deepEqual({ ...harness.storage }, { ...preferences, ...privateData });
});

test('legacy imports restore preferences without overwriting existing account data', () => {
	const harness = createHarness({ ...privateData, 'spkmod-reset-timer': 'false' });
	harness.importSettings(JSON.stringify({
		...preferences,
		...privateData,
		'spkmod-saved-accounts': '[]',
		'spkmod-translate-email': 'different@example.invalid',
		'spkmod-future-secret': 'replacement'
	}));
	assert.deepEqual({ ...harness.storage }, {
		...privateData, 'spkmod-reset-timer': 'false', ...preferences
	});
	assert.deepEqual(harness.alerts, ['settingsImportSuccess']);
	assert.equal(harness.reloadCount, 1);
});

test('export/import round trip preserves preferences without creating accounts', async () => {
	const exported = await createHarness({ ...preferences, ...privateData }).exportSettings();
	const target = createHarness();
	target.importSettings(JSON.stringify(exported));
	assert.deepEqual({ ...target.storage }, preferences);
	assert.equal(target.storage.getItem('spkmod-saved-accounts'), null);
});

test('legacy credentials cannot be introduced into an empty profile', () => {
	const harness = createHarness();
	harness.importSettings(JSON.stringify({ ...privateData, ...preferences }));
	assert.deepEqual({ ...harness.storage }, preferences);
});

test('invalid JSON, containers, and preference types do not partially apply', () => {
	const invalidFiles = ['{', 'null', '[]', '"text"', '42', 'true'];
	for (const value of [null, false, 1, {}, []]) {
		invalidFiles.push(JSON.stringify({ 'spkmod-lang': 'en', 'spkmod-ui-scale': value }));
	}
	for (const file of invalidFiles) {
		const harness = createHarness({ ...preferences, ...privateData });
		harness.importSettings(file);
		assert.deepEqual(harness.alerts, ['settingsImportInvalid'], file);
		assert.equal(harness.reloadCount, 0, file);
		assert.deepEqual({ ...harness.storage }, { ...preferences, ...privateData }, file);
	}
});

test('empty settings export and import remain supported', async () => {
	const harness = createHarness();
	assert.deepEqual(await harness.exportSettings(), {});
	harness.importSettings('{}');
	assert.deepEqual({ ...harness.storage }, {});
	assert.deepEqual(harness.alerts, ['settingsImportSuccess']);
});
