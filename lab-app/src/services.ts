import { Book, User } from './models';
import { Library } from './library';
import {Storage} from "./storage";
const BOOKS_KEY = "books";
const USERS_KEY = "users";

export class LibraryService {
    private savedBooks: Book[] = [];
    private savedUsers: User[] = [];

    constructor() {
        this.load();
    }

    // ====== LocalStorage ======
    private load(): void {
        const books = localStorage.getItem(BOOKS_KEY);
        const users = localStorage.getItem(USERS_KEY);
        this.savedBooks = books ? JSON.parse(books) : [];
        this.savedUsers = users ? JSON.parse(users) : [];
    }

    private save(): void {
        localStorage.setItem(BOOKS_KEY, JSON.stringify(this.savedBooks));
        localStorage.setItem(USERS_KEY, JSON.stringify(this.savedUsers));
    }

    // ====== Book methods ======
    addBook(book: Book): string {
        // Перевірка: всі поля обов’язкові
        if (!book.id || !book.title || !book.author || !book.year) {
            return "❌ Всі поля книги обов’язкові!";
        }

        // Рік видання: тільки 4 цифри
        const yearRegex = /^(19|20)\d{2}$/;
        if (!yearRegex.test(book.year.toString())) {
            return "❌ Рік видання має бути у форматі YYYY (1900-2099)";
        }

        // Унікальність id
        if (this.savedBooks.find(b => b.id === book.id)) {
            return "❌ Книга з таким ID вже існує!";
        }

        this.savedBooks.push(book);
        this.save();
        return "✅ Книга успішно додана!";
    }

    removeBook(bookId: number): void {
        this.savedBooks = this.savedBooks.filter(b => b.id !== bookId);
        this.save();
    }

    searchBooks(query: string): Book[] {
        return this.savedBooks.filter(
            b =>
                b.title.toLowerCase().includes(query.toLowerCase()) ||
                b.author.toLowerCase().includes(query.toLowerCase())
        );
    }
    // ====== Getters ======
    getBooks(): Book[] {
        return this.savedBooks;
    }

    getUsers(): User[] {
        return this.savedUsers;
    }


    getAvailableBooks(): Book[] {
        return this.savedBooks.filter(b => !b.isBorrowed);
    }

    // ====== User methods ======
    addUser(user: User): string {
        if (!user.id || !user.name || !user.email) {
            return "❌ Всі поля користувача обов’язкові!";
        }

        // id тільки цифри
        const idRegex = /^[0-9]+$/;
        if (!idRegex.test(user.id.toString())) {
            return "❌ ID користувача має містити лише цифри!";
        }

        // Email базова перевірка
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(user.email)) {
            return "❌ Невірний формат email!";
        }

        // Унікальність id
        if (this.savedUsers.find(u => u.id === user.id)) {
            return "❌ Користувач з таким ID вже існує!";
        }

        this.savedUsers.push(user);
        this.save();
        return "✅ Користувач успішно доданий!";
    }

    removeUser(userId: number): void {
        this.savedUsers = this.savedUsers.filter(u => u.id !== userId);
        this.save();
    }

    // ====== Borrow / Return ======
    borrowBook(bookId: number, userId: number): string {
        const book = this.savedBooks.find(b => b.id === bookId);
        const user = this.savedUsers.find(u => u.id === userId);

        if (!book || !user) return "❌ Книга або користувач не знайдені!";
        if (book.isBorrowed) return "❌ Книга вже зайнята!";
        if (user.borrowedBooks.length >= 3)
            return "❌ Неможливо взяти більше 3-х книг!";

        book.isBorrowed = true;
        user.borrowedBooks.push(bookId);
        this.save();
        return "✅ Книга успішно позичена!";
    }

    returnBook(bookId: number, userId: number): string {
        const book = this.savedBooks.find(b => b.id === bookId);
        const user = this.savedUsers.find(u => u.id === userId);

        if (!book || !user) return "❌ Книга або користувач не знайдені!";

        book.isBorrowed = false;
        user.borrowedBooks = user.borrowedBooks.filter(id => id !== bookId);
        this.save();
        return "✅ Книга повернена!";
    }
}

