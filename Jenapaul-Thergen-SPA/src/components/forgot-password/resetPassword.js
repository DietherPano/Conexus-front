import axios from 'axios';
import ResetPass from './subComponents/resetPassword';

export default function ResetPassMain(root) {
    ResetPass(root); 
    initResetPassword(); 
}

function initResetPassword() { 

    const changePasswordForm = document.getElementById('changePassForm');
    const popupOverlay = document.getElementById('popupOverlay');
    const contentError = document.getElementById('contentError');
    const errorMessage = document.getElementById('errorMessage');

    if (!changePasswordForm) {
        console.error('changePassForm element not found.');
        return;
    }

    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        contentError.style.display = 'none';
        errorMessage.style.display = 'none';

        const payload = { newPassword, confirmPassword };

        axios.post(`http://localhost:3000/v1/forgotpassword/reset_password`, payload, {
            headers: {
                apikey: `jenather`,
                token: localStorage.getItem('token'), 
            }
        })
        .then((response) => {
            if (response.data.success === true) {
                popupOverlay.style.display = 'block';

                const continueBtn = document.getElementById('continueBtn');
                const closePopup = document.getElementById('closePopup');

                if (continueBtn) {
                    continueBtn.addEventListener('click', () => {
                        popupOverlay.style.display = 'none';
                    });
                }

                if (closePopup) {
                    closePopup.addEventListener('click', () => {
                        popupOverlay.style.display = 'none';
                    });
                }
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
