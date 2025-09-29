export class Modal {
    private modalElement: HTMLElement | null;
    private bodyElement: HTMLElement | null;
    private footerElement: HTMLElement | null;
    private bsModal: any;

    constructor(modalId: string) {
        this.modalElement = document.getElementById(modalId);
        this.bodyElement = this.modalElement?.querySelector("#modal-body") || null;
        this.footerElement = this.modalElement?.querySelector("#modal-footer") || null;

        // ініціалізація Bootstrap Modal
        if ((window as any).bootstrap && this.modalElement) {
            this.bsModal = new (window as any).bootstrap.Modal(this.modalElement);
        }
    }

    open(): void {
        this.bsModal?.show();
    }

    close(): void {
        this.bsModal?.hide();
    }

    showMessage(message: string): void {
        if (this.bodyElement && this.footerElement) {
            this.bodyElement.innerHTML = `<p>${message}</p>`;
            this.footerElement.innerHTML = `
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Зрозуміло</button>
            `;
            this.open();
        }
    }

    confirm(message: string, onConfirm: () => void): void {
        if (this.bodyElement && this.footerElement) {
            this.bodyElement.innerHTML = `<p>${message}</p>`;
            this.footerElement.innerHTML = `
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Скасувати</button>
                <button type="button" class="btn btn-primary" id="confirmBtn">Підтвердити</button>
            `;
            this.open();

            const confirmBtn = document.getElementById("confirmBtn");
            confirmBtn?.addEventListener("click", () => {
                onConfirm();
                this.close();
            });
        }
    }
}
