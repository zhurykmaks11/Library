// src/storage.ts
export class Storage<T> {
    constructor(private key: string) {}

    save(items: T[]): void {
        try {
            localStorage.setItem(this.key, JSON.stringify(items));
        } catch (e) {
            console.error('Storage.save error', e);
        }
    }

    load(): T[] {
        const raw = localStorage.getItem(this.key);
        if (!raw) return [];
        try {
            return JSON.parse(raw) as T[];
        } catch (e) {
            console.error('Storage.load parse error', e);
            return [];
        }
    }

    clear(): void {
        localStorage.removeItem(this.key);
    }
}
