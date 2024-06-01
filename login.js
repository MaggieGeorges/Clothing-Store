"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Login {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.closeButton = document.querySelector('.close-btn');
        if (this.loginForm) {
            this.loginForm.addEventListener('submit', this.handleSubmit.bind(this));
        }
        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.handleClose.bind(this));
        }
    }
    handleSubmit(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            console.log('Login form submitted');
            console.log('Username:', username);
            console.log('Password:', password);
            // Validate input fields
            if (username === '') {
                alert('Username is required.');
                return;
            }
            if (password === '') {
                alert('Password is required.');
                return;
            }
            try {
                const response = yield fetch(`http://localhost:3000/users?username=${username}&password=${password}`);
                const users = yield response.json();
                if (users.length > 0) {
                    const user = users[0];
                    console.log('User authenticated:', user);
                    // Save user data in localStorage
                    localStorage.setItem('userDetails', JSON.stringify(user));
                    window.location.href = 'index.html';
                }
                else {
                    alert('Invalid username or password.');
                }
            }
            catch (error) {
                console.error('Error logging in:', error);
                alert('An error occurred while logging in. Please try again later.');
            }
        });
    }
    handleClose() {
        console.log('X button clicked');
        window.location.href = 'index.html';
    }
}
const login = new Login();
