
export class Modal {
    private modal: any;
    private body: HTMLElement | null;
    private footer: HTMLElement | null;

    constructor() {
        const modalElement = document.getElementById("mainModal");
        this.modal = modalElement ? new (window as any).bootstrap.Modal(modalElement) : null;
        this.body = document.getElementById("modal-body");
        this.footer = document.getElementById("modal-footer");
    }

    showMessage(message: string, buttonText: string = "Закрити"): void {
        if (!this.body || !this.footer) return;
        this.body.innerHTML = `<p>${message}</p>`;
        this.footer.innerHTML = `
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">${buttonText}</button>
        `;
        this.modal?.show();
    }

    showBorrowForm(onSave: (userId: number) => void): void {
        if (!this.body || !this.footer) return;

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
            const input = (document.getElementById("borrowUserId") as HTMLInputElement).value;
            const userId = Number(input);
            if (!userId) return;
            this.modal?.hide();
            onSave(userId);
        });
    }
}
