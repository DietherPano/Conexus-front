import axios from 'axios';
import '../styles/coneXus.css'

export default function CreateAccount(root){
    root.innerHTML = `
    <div id="createAccountPage">
      <div class="container">
        <form enctype="multipart/form-data" id="signup">
          <h2>Create Account</h2>
          <div class="input-group">
            <label for="username"><b>Username</b></label>
            <input type="text"  name="username" required>
            <span id="usernameError" style="display: none; color: red;"></span>
          </div>
          <div class="input-group">
            <label for="email"><b>Email</b></label>
            <input type="email" name="email" required>
            <span id="emailError" style="display: none; color: red;"></span>
          </div>
          <div class="input-group">
            <label for="password"><b>Password</b></label>
            <input type="password" name="password" required>
          </div>
          <div class="input-group">
            <label for="fullname"><b>Fullname</b></label>
            <input type="text" name="fullname" required>
          </div>
          <button type="submit">Sign Up</button>
          <span class="crtAcct">Don't have an account? <a href="/signin">Sign In</a></span>
          <div id="errorMessage" style="display: none; color: red;">
            Failed to create account
          </div>
        </form>
      </div>
    </div>
    <div class="message-popup-overlay" id="popupOverlay" style="display: none;">
      <div class="popup" id="popup">
          <span class="close" id="closePopup">&times;</span>
          <div class="popup-content">
            <p>Thanks for creating an account!</p>
            <h3>Welcome to ConeXus</h3>
            <button data-path="/signin">Continue</button>
          </div>
      </div>
    </div>        
    `;

    const signUp = document.getElementById('signup');
    const popupOverlay = document.getElementById('popupOverlay');
    const errorMessage = document.getElementById('errorMessage');
    const usernameError = document.getElementById('usernameError');
    const emailError = document.getElementById('emailError');

    signUp.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target)

      usernameError.style.display = 'none';
      emailError.style.display = 'none';
      errorMessage.style.display = 'none';

      axios.post(`http://localhost:3000/v1/account`, formData, {
        headers: {
          apikey: `jenather`,
        }
      })
      .then((response) => {
        if (response.data.success === true){
          popupOverlay.style.display = 'block';
        }
        const message = response.data.message;
        if (message === 'username'){
          usernameError.textContent = 'Username already exist';
          usernameError.style.display = 'block';
        } else if (message === 'email'){
          emailError.textContent = "Email already exist";
          emailError.style.display = 'block';
        }
      })
      .catch((error) => {
        console.error('<error>', error)
      })
    })
}