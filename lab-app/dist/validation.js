export var Validation;
(function (Validation) {
    function isValidYear(year) {
        const regex = /^[0-9]{4}$/;
        return regex.test(year);
    }
    Validation.isValidYear = isValidYear;
    function isValidId(id) {
        const regex = /^[0-9]+$/;
        return regex.test(id);
    }
    Validation.isValidId = isValidId;
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    Validation.isValidEmail = isValidEmail;
    function isNotEmpty(value) {
        return value.trim().length > 0;
    }
    Validation.isNotEmpty = isNotEmpty;
})(Validation || (Validation = {}));
//# sourceMappingURL=validation.js.map