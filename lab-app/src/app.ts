import { Modal } from "./modal.js";
import { LibraryService } from "./services.js";
import { Book, User } from "./models.js";


class App {
    private libraryService: LibraryService;
    private modal: Modal;

    constructor() {
        this.libraryService = new LibraryService();
        this.modal = new Modal();
        this.init();
    }

    private init(): void {
        this.renderBooks();
        this.renderUsers();
        this.populateYears();

        // додавання книги
        const addBookForm = document.getElementById("addBookForm") as HTMLFormElement;
        addBookForm?.addEventListener("submit", e => {
            e.preventDefault();
            const title = (document.getElementById("bookTitle") as HTMLInputElement).value;
            const author = (document.getElementById("bookAuthor") as HTMLInputElement).value;
            const year = Number((document.getElementById("bookYear") as HTMLInputElement).value);

            this.libraryService.addBook({title, author, year});
            this.modal.showMessage("✅ Книга успішно додано!");
            this.renderBooks();
        });

        // додавання користувача
        const addUserForm = document.getElementById("addUserForm") as HTMLFormElement;
        addUserForm?.addEventListener("submit", e => {
            e.preventDefault();
            const idI = document.getElementById("userId") as HTMLInputElement;
            const name = (document.getElementById("userName") as HTMLInputElement).value;
            const email = (document.getElementById("userEmail") as HTMLInputElement).value;

            this.libraryService.addUser({name, email});
            this.modal.showMessage("✅ Користувача успішно додано!");
            this.renderUsers();
        });
    }

    private renderBooks(): void {
        const booksList = document.getElementById("booksList");
        if (!booksList) return;

        const books = this.libraryService.getBooks();

        booksList.innerHTML = books.map((b: Book) => `
            <div class="border-bottom py-2">
                <strong>${b.id}) (${b.title})</strong> — ${b.author} (${b.year})<br>
                <em>${b.isBorrowed ? "Зайнята" : "Вільна"}</em><br>

                <button data-action="remove-book" data-id="${b.id}" class="btn btn-sm btn-danger">❌ Видалити</button>
                ${b.isBorrowed
            ? `<button data-action="return-book" data-id="${b.id}" class="btn btn-sm btn-warning">🔙 Повернути</button>`
            : `<button data-action="borrow-book" data-id="${b.id}" class="btn btn-sm btn-success">📖 Позичити</button>`
        }
            </div>
        `).join("");

        // обробники подій
        booksList.querySelectorAll("[data-action]").forEach(btn => {
            const action = btn.getAttribute("data-action");
            const id = Number(btn.getAttribute("data-id"));

            switch (action) {
                case "remove-book":
                    btn.addEventListener("click", () => {
                        const message = this.libraryService.removeBook(id);
                        this.modal.showMessage(message);
                        this.renderBooks();
                        this.renderUsers();
                    });
                    break;


                case "return-book":
                    btn.addEventListener("click", () => {
                        const users = this.libraryService.getUsers();
                        const user = users.find(u => u.borrowedBooks.includes(id));
                        if (user) {
                            this.libraryService.returnBook(id, user.id);

                            this.renderBooks();
                            this.renderUsers();
                            this.modal.showMessage("✅ Книгу успішно повернено!" + (user ? ` Користувач: ${user.name}` : ""));
                        }
                    });
                    break;

                case "borrow-book":
                    btn.addEventListener("click", () => {
                        this.modal.showBorrowForm((userId: number) => {
                            const message = this.libraryService.borrowBook(id, userId);
                            this.modal.showMessage(message);
                            this.renderBooks();
                            this.renderUsers();
                        });
                    });
                    break;

            }
        });
    }

    private removeUser(userId: number): void {
        if (this.libraryService.getUsers().find(u => u.id === userId)?.borrowedBooks.length) {
            this.modal.showMessage("❌ Користувача не можна видалити, поки він має позичені книги!");
            return;
        }

        this.libraryService.removeUser(userId);
        this.renderUsers();
        this.modal.showMessage("✅ Користувача успішно видалено!");
    }

    private renderUsers(): void {
        const usersList = document.getElementById("usersList");
        if (!usersList) return;

        const users = this.libraryService.getUsers();

        usersList.innerHTML = users.map((u: User) => `
        <div class="border-bottom py-2">
            <strong>${u.id} ${u.name}</strong> (${u.email})<br>
            Позичені книги: ${u.borrowedBooks.length ? u.borrowedBooks.join(", ") : "немає"}<br>
            {$
            <br>
            <button data-action="remove-user" data-id="${u.id}" class="btn btn-sm btn-danger">❌ Видалити</button>
        </div>
    `).join("");

        // слухачі кнопок видалення
        usersList.querySelectorAll("[data-action='remove-user']").forEach(btn => {
            const id = Number(btn.getAttribute("data-id"));
            btn.addEventListener("click", () => this.removeUser(id));
        });
    }


    private populateYears(): void {
        const yearSelect = document.getElementById("bookYear") as HTMLSelectElement;
        if (!yearSelect) return;

        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 1900; year--) {
            const option = document.createElement("option");
            option.value = year.toString();
            option.textContent = year.toString();
            yearSelect.appendChild(option);
        }
    }

}
document.addEventListener("DOMContentLoaded", () => {
    new App();
});

