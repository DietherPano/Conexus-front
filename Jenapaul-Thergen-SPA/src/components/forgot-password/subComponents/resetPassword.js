// import '../../../styles/forgot-pass/forgotPassword.css';
// import '../../../styles/forgot-pass/resetPassword.css';

export default function ResetPass(root) {
    root.innerHTML = `
    <div class="container">
        <form enctype="multipart/form-data" id="changePassForm">
            
            <input type="password" id="newPassword" name="newPassword" placeholder="New Password" required>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Re-type New Password" required>

            <span id="contentError" style="display: none; color: red;">Please input a valid email</span>
            <span id="errorMessage" style="display: none; color: red;"></span>
            <button class="post-button" type="submit">Send</button>
        </form>
    </div>

    <div class="message-popup-overlay" id="popupOverlay" style="display: none;">
        <div class="popup" id="popup">
            <span class="close" id="closePopup">&times;</span>
            <div class="popup-content">
                <p>You did It</p>
                <h3>Successfully Changed!</h3>
                <button id="continueBtn" data-path="/signin">Continue</button>
            </div>
        </div>
    </div>
    `;
}
