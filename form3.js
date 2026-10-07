const form = document.getElementById("registrationForm");

const fields = {
    fullName: document.getElementById("fullName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    password: document.getElementById("password"),
    confirmPassword: document.getElementById("confirmPassword"),
    terms: document.getElementById("terms")
};

const errors = {
    fullName: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    phone: document.getElementById("phoneError"),
    password: document.getElementById("passwordError"),
    confirmPassword: document.getElementById("confirmPasswordError"),
    terms: document.getElementById("termsError")
};

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const successMessage = document.getElementById("successMessage");
const resetButton = document.getElementById("resetButton");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\d{10}$/;

function setFieldState(field, message) {
    const errorElement = errors[field.id];

    if (message) {
        field.classList.add("invalid");
        field.classList.remove("valid");
        field.setAttribute("aria-invalid", "true");
        errorElement.textContent = message;
        return false;
    }

    field.classList.remove("invalid");
    field.classList.add("valid");
    field.setAttribute("aria-invalid", "false");
    errorElement.textContent = "";
    return true;
}

function validateName() {
    const value = fields.fullName.value.trim();

    if (!value) {
        return setFieldState(fields.fullName, "Please enter your full name.");
    }

    if (value.length < 5) {
        return setFieldState(fields.fullName, "Name must contain at least 5 characters.");
    }

    if (!/^[A-Za-z][A-Za-z\s.'-]+$/.test(value)) {
        return setFieldState(fields.fullName, "Please use letters and normal name characters only.");
    }

    return setFieldState(fields.fullName, "");
}

function validateEmail() {
    const value = fields.email.value.trim();

    if (!value) {
        return setFieldState(fields.email, "Please enter your email address.");
    }

    if (!emailPattern.test(value)) {
        return setFieldState(fields.email, "Please enter a valid email address.");
    }

    return setFieldState(fields.email, "");
}

function validatePhone() {
    const value = fields.phone.value.trim();

    if (!value) {
        return setFieldState(fields.phone, "Please enter your phone number.");
    }

    if (!phonePattern.test(value)) {
        return setFieldState(fields.phone, "Enter exactly 10 digits.");
    }

    if (/^(\d)\1{9}$/.test(value) || value === "1234567890") {
        return setFieldState(fields.phone, "Please enter a realistic phone number.");
    }

    return setFieldState(fields.phone, "");
}

function getPasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
}

function updatePasswordStrength() {
    const password = fields.password.value;
    const score = getPasswordStrength(password);

    const states = [
        { width: "0%", color: "#c74747", text: "Password strength" },
        { width: "20%", color: "#c74747", text: "Very weak" },
        { width: "40%", color: "#d88442", text: "Weak" },
        { width: "60%", color: "#d3a52d", text: "Fair" },
        { width: "80%", color: "#579b55", text: "Good" },
        { width: "100%", color: "#287a55", text: "Strong" }
    ];

    const state = states[score];

    strengthBar.style.width = state.width;
    strengthBar.style.background = state.color;
    strengthText.textContent = state.text;
}

function validatePassword() {
    const password = fields.password.value;
    const fullName = fields.fullName.value.trim().toLowerCase();

    updatePasswordStrength();

    if (!password) {
        return setFieldState(fields.password, "Please create a password.");
    }

    if (password.length < 8) {
        return setFieldState(fields.password, "Password must contain at least 8 characters.");
    }

    if (!/[a-z]/.test(password)) {
        return setFieldState(fields.password, "Add at least one lowercase letter.");
    }

    if (!/[A-Z]/.test(password)) {
        return setFieldState(fields.password, "Add at least one uppercase letter.");
    }

    if (!/\d/.test(password)) {
        return setFieldState(fields.password, "Add at least one number.");
    }

    if (password.toLowerCase() === "password") {
        return setFieldState(fields.password, "Please choose a password other than 'password'.");
    }

    if (fullName && password.toLowerCase() === fullName) {
        return setFieldState(fields.password, "Your password should not be the same as your name.");
    }

    return setFieldState(fields.password, "");
}

function validateConfirmPassword() {
    const password = fields.password.value;
    const confirmation = fields.confirmPassword.value;

    if (!confirmation) {
        return setFieldState(fields.confirmPassword, "Please confirm your password.");
    }

    if (password !== confirmation) {
        return setFieldState(fields.confirmPassword, "Passwords do not match.");
    }

    return setFieldState(fields.confirmPassword, "");
}

function validateTerms() {
    if (!fields.terms.checked) {
        errors.terms.textContent = "Please accept the terms to continue.";
        return false;
    }

    errors.terms.textContent = "";
    return true;
}

function validateAll() {
    const results = [
        validateName(),
        validateEmail(),
        validatePhone(),
        validatePassword(),
        validateConfirmPassword(),
        validateTerms()
    ];

    return results.every(Boolean);
}

function resetValidationState() {
    Object.values(fields).forEach((field) => {
        if (field !== fields.terms) {
            field.classList.remove("valid", "invalid");
            field.removeAttribute("aria-invalid");
        }
    });

    Object.values(errors).forEach((error) => {
        error.textContent = "";
    });

    strengthBar.style.width = "0%";
    strengthText.textContent = "Password strength";
    successMessage.classList.remove("show");
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.classList.remove("show");

    if (!validateAll()) {
        const firstInvalid = form.querySelector(".invalid");

        if (firstInvalid) {
            firstInvalid.focus();
        }

        return;
    }

    successMessage.classList.add("show");
});

fields.fullName.addEventListener("input", validateName);
fields.email.addEventListener("input", validateEmail);
fields.phone.addEventListener("input", () => {
    fields.phone.value = fields.phone.value.replace(/\D/g, "").slice(0, 10);
    validatePhone();
});

fields.password.addEventListener("input", () => {
    validatePassword();

    if (fields.confirmPassword.value) {
        validateConfirmPassword();
    }
});

fields.confirmPassword.addEventListener("input", validateConfirmPassword);
fields.terms.addEventListener("change", validateTerms);

document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
        const target = document.getElementById(button.dataset.target);
        const shouldShow = target.type === "password";

        target.type = shouldShow ? "text" : "password";
        button.textContent = shouldShow ? "Hide" : "Show";
        button.setAttribute(
            "aria-label",
            shouldShow ? "Hide password" : "Show password"
        );
    });
});

resetButton.addEventListener("click", () => {
    setTimeout(() => {
        resetValidationState();
    }, 0);
});
