import '../../../styles/forgot-pass/forgotPassword.css';
import '../../../styles/forgot-pass/verifyOTP.css';

export default function ForgotPass(root) {
    root.innerHTML = `
    <div class="forgotPass-container">
      <div class="forgotPass-header">
        <button class="cancel-button" id="closePopup" data-path="/signin">Cancel</button>
        <h2>Forgot Password</h2>
      </div>
   
      <div class="forgotPass-Form">
        <form enctype="multipart/form-data" id="forgotPassForm">
          <input type="email" id="email" name="email" placeholder="Enter Your Email" required>
          <span id="contentError" style="display: none; color: red;">Please input a valid email</span>
          <span id="errorMessage" style="display: none; color: red;"></span>
          <button class="button-send" type="submit">Send</button>
        </form>
      </div>
      <div class="verify-container-form">
        <form enctype="multipart/form-data" id="verifyOTP">
          <input type="number" name="number" required maxlength="1" class="otp-input" >
          <input type="number" name="number" required maxlength="1" class="otp-input" >
          <input type="number" name="number" required maxlength="1" class="otp-input" >
          <input type="number" name="number" required maxlength="1"class="otp-input" >
          <input type="number" name="number" required maxlength="1"class="otp-input"  >
          <input type="number" name="number" required maxlength="1" class="otp-input" >
          <span id="otpError" style="display: none; color: red;">Please enter the complete OTP</span>
          <button class="post-button-submit"type="submit">Submit</button>
        </form>
      </div>
    </div>

    <div class="message-popup-overlay" id="popupOverlay" style="display: none;">
      <div class="popup" id="popup">
          <span class="close" id="closePopup">&times;</span>
          <div class="popup-content">
            <p>Otp sent succesfully</p>
            <h3>Check Your Inbox</h3>
            <button id="continueBtn">Continue</button>
          </div>
      </div>
    </div>

    <div class="message-popup-overlay" id="popupOverlayotp" style="display: none;">
      <div class="popup" id="popup">
          <span class="close" id="closePopup">&times;</span>
          <div class="popup-content">
            <p>You did It</p>
            <h3>You can change your password now!</h3>
            <button data-path="/changing">Continue</button>
          </div>
      </div>
    </div>


    `;
}