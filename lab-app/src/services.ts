import { Book, User } from './models.js';
import { Modal } from './modal.js';
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

    addBook(book: Omit<Book, "id" | "isBorrowed">): string {
        const newBook = new Book(
            this.generateBookId(),
            book.title,
            book.author,
            book.year,
            false
        );

        // Валідація року
        const yearRegex = /^(19|20)\d{2}$/;
        if (!yearRegex.test(newBook.year.toString())) {
            return "❌ Рік видання має бути у форматі YYYY (1900-2099)";
        }

        this.savedBooks.push(newBook);
        this.save();
        return "✅ Книга успішно додана!";
    }


    removeBook(bookId: number): string {
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

    private generateBookId(): number {
        return this.savedBooks.length > 0
            ? Math.max(...this.savedBooks.map(b => b.id)) + 1
            : 1;
    }

    private generateUserId(): number {
        return this.savedUsers.length > 0
            ? Math.max(...this.savedUsers.map(u => u.id)) + 1
            : 1;
    }

    getAvailableBooks(): Book[] {
        return this.savedBooks.filter(b => !b.isBorrowed);
    }


    addUser(user: Omit<User, "id" | "borrowedBooks">): string {
        const newUser = new User(
            this.generateUserId(),
            user.name,
            user.email,
            []
        );

        // Email базова перевірка
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newUser.email)) {
            return "❌ Невірний формат email!";
        }

        this.savedUsers.push(newUser);
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

        if (!book || !user)
            return "❌ Книга або користувач не знайдені!";
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

