import { readFileSync } from "node:fs";
import * as path from"node:path";
import { defineConfig } from "rolldown";

const licensePath = path.join(import.meta.dirname, "THIRD-PARTY-LICENSES");
const licenseText = readFileSync(licensePath, "utf8");

function formatComment(text) {
	const trimmed = text.trim();
	const lines = trimmed.split("\n").map(line => "* " + line);
	return `/*\n${lines.join("\n")}\n*/\n`;
}

export default defineConfig({
	input: "src/SpeakiMod.js",
	output: {
		file: "SpeakiMod.js",
		format: "es",
		banner: formatComment(licenseText),
		sourcemap: true,
		sourcemapBaseUrl: "https://raw.githubusercontent.com/DJTOMATO/SpeakiRPG/refs/heads/main"
	}
});
