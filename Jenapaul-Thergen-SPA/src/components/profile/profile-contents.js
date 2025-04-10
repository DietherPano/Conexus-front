import '../../styles/profile-contents.css';
import AccountPost from './subComponents/account-post';
import RepliesPost from './subComponents/replies-post';
import RepostContents from './subComponents/repost-contents'; 
import axios from 'axios';

export default function ProfileContents(root) {
    console.log('Rendering ProfileContents...');
    axios.get('http://localhost:3000/v1/account', {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        if (response.data.success === true) {
            const data = response.data.data;
            root.innerHTML = `
                <div class="profile-container">
                    <div class="profile-header">
                        <div class="profile-details">
                            <h1>${data.username}</h1>
                            <p>${data.fullname}</p>
                            <div>BIO</div>
                            <span>${data.bio ? data.bio : ''}</span>
                        </div>
                        <div>
                            <img src="${data.profile_img ? data.profile_img : '../../icons/user.png'}" class="profile-picture" alt="profile">
                        </div>
                    </div>
                    <button id="edit-profile-button" data-path="/editProfile">Edit profile</button>
                    <div class="tabs">
                        <button class="tab-button active" id="threads-tab">Threads</button>
                        <button class="tab-button" id="replies-tab">Replies</button>
                        <button class="tab-button" id="reposts-tab">Reposts</button>
                    </div>
                    <div id="profile-contents"></div>
                    <button id="post-button">+</button>
                </div>
                <div id="popUpProfile"></div>
                <div class="newPost-popUp-overLay" id="popupOverlay" style="display: none;"></div>
            `;

            const contents = document.getElementById('profile-contents');
            AccountPost(contents);

            // Threads Tab
            const threadsTab = document.getElementById('threads-tab');
            threadsTab.addEventListener('click', () => {
                AccountPost(contents);
            });

            // Replies Tab
            const repliesTab = document.getElementById('replies-tab');
            repliesTab.addEventListener('click', () => {
                RepliesPost(contents);
            });

            // Reposts Tab
            const repostsTab = document.getElementById('reposts-tab');
            repostsTab.addEventListener('click', () => {
                RepostContents(contents);
            });

            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    document.querySelector('.tab-button.active').classList.remove('active');
                    button.classList.add('active');
                });
            });
        }
    })
    .catch((error) => {
        console.error('Error fetching profile data:', error);
    });
}
