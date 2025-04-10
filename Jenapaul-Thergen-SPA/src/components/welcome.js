import '../styles/coneXus.css'

export default function WelcomePage(root){
    root.innerHTML = `
      <div class="welcome-container" id="welcomePage">
        <div class="wlcmPage">
        <h2>CONEXUS</h2>
        </div>
        <div class="button-container">
            <a href="/signin" class="signIn" id="signin">Sign In</a>
            <a href="/signup" class="signUp" id="signup">Sign Up</a>
        </div>
      </div>
    `;
}