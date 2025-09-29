import { Book, User } from './models';
import { LibraryService } from './services';
import { Validation } from './validation';
import { Modal } from './modal';

class App {
    private libraryService: LibraryService;
    private modal: Modal;

    constructor() {
        this.libraryService = new LibraryService();
        this.modal = new Modal("appModal");

        this.initEventListeners();
        this.renderBooks();
        this.renderUsers();
    }

    private initEventListeners(): void {
        const addBookForm = document.getElementById("addBookForm") as HTMLFormElement;
        const addUserForm = document.getElementById("addUserForm") as HTMLFormElement;

        if (addBookForm) {
            addBookForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.addBook();
            });
        }

        if (addUserForm) {
            addUserForm.addEventListener("submit", (e) => {
                e.preventDefault();
                this.addUser();
            });
        }
    }

    private addBook(): void {
        const id = (document.getElementById("bookId") as HTMLInputElement).value;
        const title = (document.getElementById("bookTitle") as HTMLInputElement).value;
        const author = (document.getElementById("bookAuthor") as HTMLInputElement).value;
        const year = (document.getElementById("bookYear") as HTMLInputElement).value;

        if (!Validation.isValidId(id) || !Validation.isNotEmpty(title) ||
            !Validation.isNotEmpty(author) || !Validation.isValidYear(year)) {
            this.modal.showMessage("Помилка: неправильні дані книги!");
            return;
        }

        const book = new Book(Number(id), title, author, Number(year));
        this.libraryService.addBook(book);
        this.renderBooks();
        this.modal.showMessage("Книга успішно додана!");
    }

    private addUser(): void {
        const id = (document.getElementById("userId") as HTMLInputElement).value;
        const name = (document.getElementById("userName") as HTMLInputElement).value;
        const email = (document.getElementById("userEmail") as HTMLInputElement).value;

        if (!Validation.isValidId(id) || !Validation.isNotEmpty(name) ||
            !Validation.isValidEmail(email)) {
            this.modal.showMessage("Помилка: неправильні дані користувача!");
            return;
        }

        const user = new User(Number(id), name, email);
        this.libraryService.addUser(user);
        this.renderUsers();
        this.modal.showMessage("Користувач успішно доданий!");
    }

    private renderBooks(): void {
        const booksList = document.getElementById("booksList");
        if (!booksList) return;

        const books = this.libraryService.getBooks();
        const users = this.libraryService.getUsers();

        booksList.innerHTML = books.map((b: Book) => `
        <div class="d-flex justify-content-between align-items-center border-bottom py-2">
            <span>${b.title} by ${b.author} (${b.year})</span>
            <div class="d-flex gap-2">
                <select class="form-select form-select-sm user-select" data-book-id="${b.id}">
                    <option value="">Виберіть користувача</option>
                    ${users.map((u: User) => `
                        <option value="${u.id}">${u.name}</option>
                    `).join("")}
                </select>
                ${b.isBorrowed
            ? `<button class="btn btn-warning btn-sm" data-action="return" data-id="${b.id}">Повернути</button>`
            : `<button class="btn btn-primary btn-sm" data-action="borrow" data-id="${b.id}">Позичити</button>`
        }
            </div>
        </div>
    `).join("");

        // Обробка кнопок
        booksList.querySelectorAll("button").forEach(btn => {
            btn.addEventListener("click", () => {
                const bookId = Number((btn as HTMLElement).getAttribute("data-id"));
                const action = (btn as HTMLElement).getAttribute("data-action");
                const select = (btn.parentElement?.querySelector(".user-select")) as HTMLSelectElement;
                const userId = Number(select.value);

                if (!userId) {
                    this.modal.showMessage("❌ Спочатку виберіть користувача!");
                    return;
                }

                if (action === "borrow") {
                    const msg = this.libraryService.borrowBook(bookId, userId);
                    // @ts-ignore
                    this.modal.showMessage(msg, msg.startsWith("✅") ? "success" : "error");
                } else {
                    const msg = this.libraryService.returnBook(bookId, userId);
                    // @ts-ignore
                    this.modal.showMessage(msg, msg.startsWith("✅") ? "success" : "error");
                }

                this.renderBooks();
                this.renderUsers();
            });
        });
    }


    private renderUsers(): void {
        const usersList = document.getElementById("usersList");
        if (!usersList) return;

        const users = this.libraryService.getUsers();

        usersList.innerHTML = users.map((u: User) => `
        <div class="border-bottom py-2">
            <strong>${u.name}</strong> (${u.email})<br>
            Позичені книги: ${u.borrowedBooks.length ? u.borrowedBooks.join(", ") : "немає"}
        </div>
    `).join("");
    }


    private borrowBook(bookId: number): void {
        this.modal.confirm("Введіть ID користувача для позичення книги:", () => {
            const userId = prompt("Введіть ID користувача"); // потім можна замінити на input в модалці
            if (userId) {
                const success = this.libraryService.borrowBook(bookId, Number(userId));
                if (success) {
                    this.renderBooks();
                    this.renderUsers();
                    this.modal.showMessage(`Книга #${bookId} успішно позичена користувачем #${userId}.`);
                } else {
                    this.modal.showMessage("Помилка: не вдалося позичити книгу.");
                }
            }
        });
    }

    private returnBook(bookId: number, userId: number): void {
        const message = this.libraryService.returnBook(bookId, userId);
        this.renderBooks();
        this.renderUsers();
        this.modal.showMessage(message);
    }

}

document.addEventListener("DOMContentLoaded", () => {
    new App();
});
