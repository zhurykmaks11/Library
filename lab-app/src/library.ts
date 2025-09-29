// src/library.ts
export class Library<T extends { id: number }> {
    private items: T[] = [];

    constructor(initial?: T[]) {
        if (initial && Array.isArray(initial)) this.items = initial.slice();
    }

    add(item: T): void { this.items.push(item); }
    remove(id: number): void { this.items = this.items.filter(i => i.id !== id); }
    findById(id: number): T | undefined { return this.items.find(i => i.id === id); }
    getAll(): T[] { return this.items.slice(); }
    clear(): void { this.items = []; }
}
