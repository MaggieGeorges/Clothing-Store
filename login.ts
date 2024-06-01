class Login {
    private loginForm: HTMLFormElement;
    private closeButton: HTMLElement;

    constructor() {
        this.loginForm = document.getElementById('loginForm') as HTMLFormElement;
        this.closeButton = document.querySelector('.close-btn') as HTMLElement;

        if (this.loginForm) {
            this.loginForm.addEventListener('submit', this.handleSubmit.bind(this));
        }

        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.handleClose.bind(this));
        }
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        const username = (document.getElementById('loginUsername') as HTMLInputElement).value.trim();
        const password = (document.getElementById('loginPassword') as HTMLInputElement).value.trim();

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
            const response = await fetch(`http://localhost:3000/users?username=${username}&password=${password}`);
            const users = await response.json();

            if (users.length > 0) {
                const user = users[0];
                console.log('User authenticated:', user);

                // Save user data in localStorage
                localStorage.setItem('userDetails', JSON.stringify(user));

                window.location.href = 'index.html';
            } else {
                alert('Invalid username or password.');
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert('An error occurred while logging in. Please try again later.');
        }
    }

    private handleClose(): void {
        console.log('X button clicked');
        window.location.href = 'index.html';
    }
}

const login = new Login();
