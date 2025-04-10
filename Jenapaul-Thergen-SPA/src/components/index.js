// Functions to show different sections
function showLogin() {
    hideAllSections();
    document.getElementById("loginPage").style.display = "block";
}

function showCreatePost() {
    hideAllSections();
    document.getElementById("creatorPost").style.display = "block";
}

function showCreateAccount() {
    hideAllSections();
    document.getElementById("createAccountPage").style.display = "block";
}

function showForgotPassword() {
    hideAllSections();
    document.getElementById("forgotPasswordPage").style.display = "block";
}

function sendOTP() {
    alert("OTP sent to your email!");
}

function resetPassword() {
    alert("Password reset successfully!");
}

function hideAllSections() {
    document.getElementById("creatorPost").style.display = "none";
    document.getElementById("welcomePage").style.display = "none";
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("createAccountPage").style.display = "none";
    document.getElementById("forgotPasswordPage").style.display = "none";
    document.getElementById("resetPasswordPage").style.display = "none";
}


// Show the popup when creating an account
function createAccount() {
    // Get values from the form
    const name = document.querySelector('input[name="fname"]').value;
    const lastName = document.querySelector('input[name="lname"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="psw"]').value;
    const confirmPassword = document.querySelector('input[name="psw-repeat"]').value;

    // Check if all fields are filled
    if (!name || !lastName || !email || !password || !confirmPassword) {
        alert("Please fill out all fields before proceeding.");
        return; // Stop the function if any field is empty
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return; // Stop the function if passwords do not match
    }

    // If all checks pass, show the popup
    const popupOverlay = document.getElementById("popupOverlay");
    popupOverlay.style.display = "flex";
}

// Close the popup when clicking the close button
document.getElementById("closePopup").onclick = function () {
    document.getElementById("popupOverlay").style.display = "none";
};

// Continue to the main page or another action
function submitForm() {
    document.getElementById("popupOverlay").style.display = "none";
    alert("Welcome to ConeXus!");
}