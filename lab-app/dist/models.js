export class Book {
    id;
    title;
    author;
    year;
    isBorrowed;
    constructor(id, title, author, year, isBorrowed = false) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.year = year;
        this.isBorrowed = isBorrowed;
    }
}
export class User {
    id;
    name;
    email;
    borrowedBooks;
    constructor(id, name, email, borrowedBooks = []) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.borrowedBooks = borrowedBooks;
    }
}
//# sourceMappingURL=models.js.map