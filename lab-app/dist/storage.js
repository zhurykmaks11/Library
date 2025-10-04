export class Storage {
    key;
    constructor(key) {
        this.key = key;
    }
    save(items) {
        try {
            localStorage.setItem(this.key, JSON.stringify(items));
        }
        catch (e) {
            console.error('Storage.save error', e);
        }
    }
    load() {
        const raw = localStorage.getItem(this.key);
        if (!raw)
            return [];
        try {
            return JSON.parse(raw);
        }
        catch (e) {
            console.error('Storage.load parse error', e);
            return [];
        }
    }
    clear() {
        localStorage.removeItem(this.key);
    }
}
//# sourceMappingURL=storage.js.map