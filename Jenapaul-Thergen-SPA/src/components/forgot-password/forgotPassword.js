import axios from 'axios';
import ForgotPass from './subComponents/requestOTP';


export default function ForgotPassMain(root) {
    ForgotPass(root);
    setupOTPInput();
    verifyOTP();
    requestOTP();
}

function setupOTPInput() {
    const otpInputs = document.querySelectorAll('.otp-input');

    otpInputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            if (input.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Backspace' && input.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
}

function verifyOTP() {
    const verifyOTPForm = document.getElementById('verifyOTP');
    const popupOverlayotp = document.getElementById('popupOverlayotp');
    const otpError = document.getElementById('otpError');
    const contentError = document.getElementById('contentError');
    const errorMessage = document.getElementById('errorMessage');

    verifyOTPForm.addEventListener('submit', (e) => {
        e.preventDefault();

        contentError.style.display = 'none';
        errorMessage.style.display = 'none';

        const email = document.getElementById('email').value;
        const otpInputs = document.querySelectorAll('.otp-input');
        const otpValues = Array.from(otpInputs).map(input => input.value).join('');

        if (otpValues.length !== otpInputs.length) {
            otpError.style.display = 'block';
            otpError.textContent = 'Please enter the complete OTP';
            return;
        }

        otpError.style.display = 'none';

        const payload = { email: email, otp: otpValues };

        axios.post('http://localhost:3000/v1/forgotpassword/verify_otp', payload, {
            headers: { apikey: 'jenather' 

            }
        })
        .then((response) => {
            if (response.data.success === true) {
                popupOverlayotp.style.display = 'block';

                const continueBtn = document.getElementById('continueBtn');
                continueBtn.addEventListener('click', () => {
                    popupOverlayotp.style.display = 'none';
                });

                const closePopup = document.getElementById('closePopup');
                closePopup.addEventListener('click', () => {
                    popupOverlayotp.style.display = 'none';
                });
            } else {
                otpError.style.display = 'block';
                otpError.textContent = 'Invalid OTP. Please try again.';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            otpError.style.display = 'block';
            otpError.textContent = 'An error occurred. Please try again.';
        });
    });
}

function requestOTP() {
    const forgotPasswordForm = document.getElementById('forgotPassForm');
    const popupOverlay = document.getElementById('popupOverlay');
    const contentError = document.getElementById('contentError');
    const errorMessage = document.getElementById('errorMessage');

    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(forgotPasswordForm);
        const payload = Object.fromEntries(formData);

        contentError.style.display = 'none';
        errorMessage.style.display = 'none';

        axios.post(`http://localhost:3000/v1/forgotpassword/request_otp`, payload, {
            headers: {
                apikey: `jenather`,
            }
        })
        .then((response) => {
            if (response.data.success === true) {
                popupOverlay.style.display = 'block';

                const continueBtn = document.getElementById('continueBtn');
                continueBtn.addEventListener('click', () => {
                    popupOverlay.style.display = 'none';
                });

                const closePopup = document.getElementById('closePopup');
                closePopup.addEventListener('click', () => {
                    popupOverlay.style.display = 'none';
                });
            } else {
                contentError.style.display = 'block';  
                contentError.textContent = 'Please input a valid email';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            errorMessage.style.display = 'block';
            errorMessage.textContent = 'An error occurred. Please try again.';
        });
    });
}
