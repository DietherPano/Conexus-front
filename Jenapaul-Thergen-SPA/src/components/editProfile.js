import '../styles/editprofile.css';
import axios from "axios";

export default function userInfo(root) {
    fetchProfile(root)

};

function fetchProfile(root){
    axios.get('http://localhost:3000/v1/account', {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token')
        }
    })
    .then((response) => {
        console.log(response)
        if (response.data.success === true){
            root.innerHTML = `
           <div class="profileHeader">
                <div class="header-column">
                    <button id="exit" data-path="/profile">&times;</button>
                </div>
                <div class="header-column">
                    <h1 id="editprofiletext">Edit Profile</h1>
                </div>
                <div class="header-column">
                    <button id="confirm" data-path="/profile">&#10004;</button>
                </div>
            </div>

            <div class="userInfo">
                    <div class="field editable">
                        <label>Profile Image</label>
                        <span id="response"></span>
                        <form enctype="multipart/form-data" id="uploadForm">
                            <input type="file" id="profile_img" name="profile_img" style="display: none;" required>
                            <button type="button" id="uploadBtn">Upload</button>
                        </form>
                    </div>
                    <div class="field">
                        <label>Fullname</label>
                        <span>${response.data.data.fullname}</span>
                    </div>
                    <div class="field">
                        <label>Email</label>
                        <span>${response.data.data.email}</span>
                    </div>
                    <div class="field editable">
                        <label>Username</label>
                        <span>${response.data.data.username}</span>
                        <button class="edit-button" id="editUsername">&#9998;</button>
                        <form id="editUsernameForm" style="display: none;">
                            <label for="username"><b>New Username</b></label>
                            <input type="text" name="username" required>
                            <button type="submit">Confirm</button>
                        </form>
                    </div>
                    <div class="field editable">
                        <label>Bio</label>
                        <span>${response.data.data.bio ? response.data.data.bio : ""}</span>
                        <button class="edit-button" id="editBio">&#9998;</button>
                        <form id="editBioForm" style="display: none;">
                            <label for="bio"><b>New Bio</b></label>
                            <input type="text" name="bio" required>
                            <button type="submit">Confirm</button>
                        </form>
                    </div>
                </div>
                
                <div id="logintext">
                    <h2>Login</h2>
                    <p>Manage your password</p>
                </div>

                <div id="login-section">
                    <button class="change-password-button" id="editPass">
                        Change Password
                        <span class="edit-button">&#9998;</span>
                        <form id="changePassForm" style="display: none;">
                            <label for="currentPass"><br>Current Password</br></label>
                            <input type="password" name="currentPass" required>
                            <label for="newPassword"><br>New Password</br></label>
                            <input type="password" name="newPassword" required>
                            <label for="confirmPass"><br>Confirm Password</br></label>
                            <input type="password" name="confirmPass" required>
                        </form>
                    </button>
                </div>
            `;

            const profileImg = document.getElementById('profile_img')
            const uploadBtn = document.getElementById('uploadBtn')
            uploadBtn.addEventListener('click', () => {
                profileImg.click();
            })

            profileImg.addEventListener('change', (e) => {
                e.preventDefault()
                if (e.target.files && e.target.files[0]){
                    const formData = new FormData()
                    formData.append('profile_img', e.target.files[0]);

                    axios.patch('http://localhost:3000/v1/account/upload', formData, {
                        headers: {
                            apikey: 'jenather',
                            token: localStorage.getItem('token'),
                        }
                    })
                    .then((response) => {
                        if (response.data.success === true){
                            console.log('ok')
                            const span = document.getElementById('response')
                            span.textContent = 'Profile Upload Successfully'
                            
                        } else{
                            console.log('not ok')
                        }
                    })
                }
            })

            const editUsernameForm = document.getElementById('editUsernameForm')
            const editBioForm = document.getElementById('editBioForm');
            const editBio = document.getElementById('editBio');
            const editUsername = document.getElementById('editUsername')
            const editPass = document.getElementById('editPass');
            const editPassForm = document.getElementById('changePassForm');

            
            editPass.addEventListener('click', () => {
                editPassForm.style.display = 'block'
            })
            editPassForm.addEventListener('submit', (e) => {
                e.preventDefault()

                const formData = new FormData(e.target);
                const payload = Object.fromEntries(formData)

                axios.patch('http://localhost:3000/v1/account/', payload, {
                    headers: {
                        apikey: 'jenather',
                        token: localStorage.getItem('token')
                    }
                })
                .then((response) => {
                    console.log(response)
                    if (response.data.success === true){
                        history.pushState({}, '', '/editProfile');
                        window.dispatchEvent(new Event('popstate'));
                    }
                })
        })
            editUsername.addEventListener('click', () => {
                editUsernameForm.style.display = 'block'
            })

            editUsernameForm.addEventListener('submit', (e) => {
                e.preventDefault()

                const formData = new FormData(e.target);
                const payload = Object.fromEntries(formData);

                axios.patch('http://localhost:3000/v1/account/', payload, {
                    headers: {
                        apikey: 'jenather',
                        token: localStorage.getItem('token')
                    }
                })
                .then((response) => {
                    console.log(response)
                    if (response.data.success === true){
                        const newToken = response.data.data.data.token
                        console.log(newToken)
                        if (newToken){
                            localStorage.setItem('token', newToken)
                            history.pushState({}, '', '/editProfile');
                            window.dispatchEvent(new Event('popstate'));
                        }
                    }
                })
            })
            editBio.addEventListener('click', () => {
                editBioForm.style.display = 'block';
            });

            editBioForm.addEventListener('submit', (e) => {
                e.preventDefault()

                const formData = new FormData(e.target);
                const payload = Object.fromEntries(formData)

                axios.patch('http://localhost:3000/v1/account/', payload, {
                    headers: {
                        apikey: 'jenather',
                        token: localStorage.getItem('token')
                    }
                })
                .then((response) => {
                    if(response.data.success === true){
                        history.pushState({}, '', '/editProfile');
                        window.dispatchEvent(new Event('popstate'));
                    }
                })
            })
        }
    })
}

            
                