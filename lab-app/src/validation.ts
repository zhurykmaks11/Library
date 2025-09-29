// validation.ts
export namespace Validation {
    export function isValidYear(year: string): boolean {
        const regex = /^[0-9]{4}$/;  // тільки 4 цифри
        return regex.test(year);
    }

    export function isValidId(id: string): boolean {
        const regex = /^[0-9]+$/; // тільки цифри
        return regex.test(id);
    }

    export function isValidEmail(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    export function isNotEmpty(value: string): boolean {
        return value.trim().length > 0;
    }
}
