import axios from 'axios';
import '../styles/loginPage.css';

export default function LogIn(root) {
    root.innerHTML = `
      <div id="loginPage">
        <div class="container">
            <h2>ConeXus</h2>
            <form enctype="multipart/form-data" id="signin">
                <label for="username"><b>Username</b></label>
                <input type="text"  name="username" required>

                <label for="password"><b>Password</b></label>
                <input type="password" name="password" required>
                <span id="errorMessage" style="display: none; color: red;"></span>

                <a href="/identify" >Forgot password?</a>
                <button type="submit">Login</button>
            </form>
            <span class="crtAcct">Don't have an account? <a href="/signup">Sign Up</a></span>
        </div>
      </div>
    `;

    const errorMessage = document.getElementById('errorMessage');
    const signIn = document.getElementById('signin');
    signIn.addEventListener('submit', (e) => {
        e.preventDefault();

        errorMessage.style.display = 'none';

        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData);

        axios.post(`http://localhost:3000/v1/account/login`, payload, {
            headers: {
                apikey: `jenather`,
            }
        })
        .then((response) => {
            console.log(response);
            if (response.data.success === true) {
                localStorage.setItem('token', response.data.data.token);
                history.pushState({}, '', '/');
                window.dispatchEvent(new Event('popstate'));
            }
            const message = response.data.message;

            if (message === 'Invalid username or password') {
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
            } else {
                errorMessage.textContent = message;
                errorMessage.style.display = 'block';
            }
        })
        .catch((error) => {
            console.error(error);
        });
    });
}
