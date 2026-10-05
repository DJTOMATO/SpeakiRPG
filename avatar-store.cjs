const fs = require('node:fs');
const path = require('node:path');

// Desktop preferences are acknowledged only after they are written to disk.
// This file contains emoji references, never authentication or recovery data.
function createAvatarFileStore(filename) {
    const validEmoji = value => value === null || (value &&
        ['custom', 'trickcal', 'trickcal2'].includes(value.pack) &&
        typeof value.name === 'string' && value.name.length > 0 && value.name.length <= 100);
    function validateIdentity(identity) {
        if (typeof identity !== 'string' || !identity.startsWith('name:') || identity.length <= 5 || identity.length > 256) {
            throw new Error('Invalid avatar identity');
        }
    }
    function read() {
        let data;
        try { data = JSON.parse(fs.readFileSync(filename, 'utf8')); }
        catch (error) { if (error.code === 'ENOENT') return {}; throw error; }
        if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid avatar preferences');
        return data;
    }
    return {
        get(identity) {
            validateIdentity(identity);
            const data = read();
            if (!Object.hasOwn(data, identity)) return undefined;
            if (!validEmoji(data[identity])) throw new Error('Invalid saved avatar');
            return data[identity];
        },
        set(identity, emoji) {
            validateIdentity(identity);
            if (!validEmoji(emoji)) throw new Error('Invalid avatar selection');
            const data = read();
            // Keep null as an explicit reset so legacy browser storage is not restored.
            data[identity] = emoji === null ? null : { pack: emoji.pack, name: emoji.name };
            fs.mkdirSync(path.dirname(filename), { recursive: true });
            const temporary = `${filename}.${process.pid}.tmp`;
            try {
                fs.writeFileSync(temporary, JSON.stringify(data), { encoding: 'utf8', flush: true });
                fs.renameSync(temporary, filename);
            } finally {
                try { fs.unlinkSync(temporary); } catch (error) { if (error.code !== 'ENOENT') throw error; }
            }
            return data[identity];
        }
    };
}

module.exports = { createAvatarFileStore };
