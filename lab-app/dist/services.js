import { Book, User } from './models.js';
const BOOKS_KEY = "books";
const USERS_KEY = "users";
export class LibraryService {
    savedBooks = [];
    savedUsers = [];
    constructor() {
        this.load();
    }
    load() {
        const books = localStorage.getItem(BOOKS_KEY);
        const users = localStorage.getItem(USERS_KEY);
        this.savedBooks = books ? JSON.parse(books) : [];
        this.savedUsers = users ? JSON.parse(users) : [];
    }
    save() {
        localStorage.setItem(BOOKS_KEY, JSON.stringify(this.savedBooks));
        localStorage.setItem(USERS_KEY, JSON.stringify(this.savedUsers));
    }
    addBook(book) {
        const newBook = new Book(this.generateBookId(), book.title, book.author, book.year, false);
        const yearRegex = /^(19|20)\d{2}$/;
        if (!yearRegex.test(newBook.year.toString())) {
            return "❌ Рік видання має бути у форматі YYYY (1900-2099)";
        }
        this.savedBooks.push(newBook);
        this.save();
        return "✅ Книга успішно додана!";
    }
    removeBook(bookId) {
        const book = this.savedBooks.find(b => b.id === bookId);
        if (!book) {
            return "❌ Книга не знайдена!";
        }
        if (book.isBorrowed) {
            return "❌ Неможливо видалити книгу, поки вона позичена користувачем!";
        }
        this.savedBooks = this.savedBooks.filter(b => b.id !== bookId);
        this.save();
        return "✅ Книга успішно видалена!";
    }
    searchBooks(query) {
        return this.savedBooks.filter(b => b.title.toLowerCase().includes(query.toLowerCase()) ||
            b.author.toLowerCase().includes(query.toLowerCase()));
    }
    getBooks() {
        return this.savedBooks;
    }
    getUsers() {
        return this.savedUsers;
    }
    generateBookId() {
        return this.savedBooks.length > 0
            ? Math.max(...this.savedBooks.map(b => b.id)) + 1
            : 1;
    }
    generateUserId() {
        return this.savedUsers.length > 0
            ? Math.max(...this.savedUsers.map(u => u.id)) + 1
            : 1;
    }
    getAvailableBooks() {
        return this.savedBooks.filter(b => !b.isBorrowed);
    }
    addUser(user) {
        const newUser = new User(this.generateUserId(), user.name, user.email, []);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newUser.email)) {
            return "❌ Невірний формат email!";
        }
        this.savedUsers.push(newUser);
        this.save();
        return "✅ Користувач успішно доданий!";
    }
    removeUser(userId) {
        this.savedUsers = this.savedUsers.filter(u => u.id !== userId);
        this.save();
    }
    borrowBook(bookId, userId) {
        const book = this.savedBooks.find(b => b.id === bookId);
        const user = this.savedUsers.find(u => u.id === userId);
        if (!book || !user)
            return "❌ Книга або користувач не знайдені!";
        if (book.isBorrowed)
            return "❌ Книга вже зайнята!";
        if (user.borrowedBooks.length >= 3)
            return "❌ Неможливо взяти більше 3-х книг!";
        book.isBorrowed = true;
        user.borrowedBooks.push(bookId);
        this.save();
        return "✅ Книга успішно позичена!";
    }
    returnBook(bookId, userId) {
        const book = this.savedBooks.find(b => b.id === bookId);
        const user = this.savedUsers.find(u => u.id === userId);
        if (!book || !user)
            return "❌ Книга або користувач не знайдені!";
        book.isBorrowed = false;
        user.borrowedBooks = user.borrowedBooks.filter(id => id !== bookId);
        this.save();
        return "✅ Книга повернена!";
    }
}
//# sourceMappingURL=services.js.map