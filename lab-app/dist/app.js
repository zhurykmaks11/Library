import { Modal } from "./modal.js";
import { LibraryService } from "./services.js";
class App {
    libraryService;
    modal;
    constructor() {
        this.libraryService = new LibraryService();
        this.modal = new Modal();
        this.init();
    }
    init() {
        this.renderBooks();
        this.renderUsers();
        this.populateYears();
        const addBookForm = document.getElementById("addBookForm");
        addBookForm?.addEventListener("submit", e => {
            e.preventDefault();
            const title = document.getElementById("bookTitle").value;
            const author = document.getElementById("bookAuthor").value;
            const year = Number(document.getElementById("bookYear").value);
            this.libraryService.addBook({ title, author, year });
            this.modal.showMessage("✅ Книга успішно додано!");
            this.renderBooks();
        });
        const addUserForm = document.getElementById("addUserForm");
        addUserForm?.addEventListener("submit", e => {
            e.preventDefault();
            const idI = document.getElementById("userId");
            const name = document.getElementById("userName").value;
            const email = document.getElementById("userEmail").value;
            this.libraryService.addUser({ name, email });
            this.modal.showMessage("✅ Користувача успішно додано!");
            this.renderUsers();
        });
    }
    renderBooks() {
        const booksList = document.getElementById("booksList");
        if (!booksList)
            return;
        const books = this.libraryService.getBooks();
        booksList.innerHTML = books.map((b) => `
            <div class="border-bottom py-2">
                <strong>${b.title}</strong> — ${b.author} (${b.year})<br>
                <em>${b.isBorrowed ? "Зайнята" : "Вільна"}</em><br>

                <button data-action="remove-book" data-id="${b.id}" class="btn btn-sm btn-danger">❌ Видалити</button>
                ${b.isBorrowed
            ? `<button data-action="return-book" data-id="${b.id}" class="btn btn-sm btn-warning">🔙 Повернути</button>`
            : `<button data-action="borrow-book" data-id="${b.id}" class="btn btn-sm btn-success">📖 Позичити</button>`}
            </div>
        `).join("");
        booksList.querySelectorAll("[data-action]").forEach(btn => {
            const action = btn.getAttribute("data-action");
            const id = Number(btn.getAttribute("data-id"));
            switch (action) {
                case "remove-book":
                    btn.addEventListener("click", () => {
                        this.libraryService.removeBook(id);
                        this.renderBooks();
                        this.modal.showMessage("✅ Книгу успішно видалено!");
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
                        this.modal.showBorrowForm((userId) => {
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
    removeUser(userId) {
        if (this.libraryService.getUsers().find(u => u.id === userId)?.borrowedBooks.length) {
            this.modal.showMessage("❌ Користувача не можна видалити, поки він має позичені книги!");
            return;
        }
        this.libraryService.removeUser(userId);
        this.renderUsers();
        this.modal.showMessage("✅ Користувача успішно видалено!");
    }
    renderUsers() {
        const usersList = document.getElementById("usersList");
        if (!usersList)
            return;
        const users = this.libraryService.getUsers();
        usersList.innerHTML = users.map((u) => `
        <div class="border-bottom py-2">
            <strong>${u.id} ${u.name}</strong> (${u.email})<br>
            Позичені книги: ${u.borrowedBooks.length ? u.borrowedBooks.join(", ") : "немає"}
            <br>
            <button data-action="remove-user" data-id="${u.id}" class="btn btn-sm btn-danger">❌ Видалити</button>
        </div>
    `).join("");
        usersList.querySelectorAll("[data-action='remove-user']").forEach(btn => {
            const id = Number(btn.getAttribute("data-id"));
            btn.addEventListener("click", () => this.removeUser(id));
        });
    }
    populateYears() {
        const yearSelect = document.getElementById("bookYear");
        if (!yearSelect)
            return;
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
//# sourceMappingURL=app.js.map