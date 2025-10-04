export class Library {
    items = [];
    constructor(initial) {
        if (initial && Array.isArray(initial))
            this.items = initial.slice();
    }
    add(item) { this.items.push(item); }
    remove(id) { this.items = this.items.filter(i => i.id !== id); }
    findById(id) { return this.items.find(i => i.id === id); }
    getAll() { return this.items.slice(); }
    clear() { this.items = []; }
}
//# sourceMappingURL=library.js.map