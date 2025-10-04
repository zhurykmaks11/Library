export class Modal {
    modal;
    body;
    footer;
    constructor() {
        const modalElement = document.getElementById("mainModal");
        this.modal = modalElement ? new window.bootstrap.Modal(modalElement) : null;
        this.body = document.getElementById("modal-body");
        this.footer = document.getElementById("modal-footer");
    }
    showMessage(message, buttonText = "Закрити") {
        if (!this.body || !this.footer)
            return;
        this.body.innerHTML = `<p>${message}</p>`;
        this.footer.innerHTML = `
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">${buttonText}</button>
        `;
        this.modal?.show();
    }
    showBorrowForm(onSave) {
        if (!this.body || !this.footer)
            return;
        this.body.innerHTML = `
            <label for="borrowUserId" class="form-label">Введіть ID користувача:</label>
            <input type="number" id="borrowUserId" class="form-control" placeholder="ID">
        `;
        this.footer.innerHTML = `
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Скасувати</button>
            <button type="button" class="btn btn-primary" id="saveBorrowBtn">Зберегти</button>
        `;
        this.modal?.show();
        document.getElementById("saveBorrowBtn")?.addEventListener("click", () => {
            const input = document.getElementById("borrowUserId").value;
            const userId = Number(input);
            if (!userId)
                return;
            this.modal?.hide();
            onSave(userId);
        });
    }
}
//# sourceMappingURL=modal.js.map