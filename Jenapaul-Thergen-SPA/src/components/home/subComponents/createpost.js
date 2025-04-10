import '../../../styles/createPost.css';
import '../../../components/header';

import axios from 'axios';

export default function CreatePost(root) {
  axios.get('http://localhost:3000/v1/account/', {
    headers: {
      apikey: 'jenather',
      token: localStorage.getItem('token'),
    }
  })
  .then((response) => {
    if (response.data.success === true) {
      const data = response.data.data;
      root.innerHTML = `
        <div id="input-post">
          <img src="${data.profile_img || '../../icons/user.png'}" alt="Profile Picture" class="post-profile-picture">
          <input id="input" type="text" name="content" placeholder="Start a thread.." disabled>

          <button class="post-button">Post</button>
        </div>

        <!-- Popup Overlay for New Post -->
        <div class="newPost-popUp-overLay" id="popupOverlay" style="display: none;">
          <div class="popUp-post" id="popUp-post">
            <div class="popUp-header">
              <span class="cancel-button" id="closePopup">Cancel</span>
              <h2>New Conexus</h2>
            </div>
            <div class="separator"></div>
            <div class="user-info">
              <img src="${data.profile_img || '../../icons/user.png'}" alt="Profile Picture" class="post-profile-picture">
              <h3>${data.username || 'Username'}</h3>
            </div>
            <div class="newPost-form">
              <form enctype="multipart/form-data" id="createpost">
                <textarea id="threadContent" name="content" placeholder="Start a conexus.." rows="5" required style="resize: none; overflow: hidden; width: 100%;"></textarea>

                <span id="contentError" style="display: none; color: red;"></span>
                <span id="errorMessage" style="display: none; color: red;"></span>
                <button class="post-button" type="submit">Post</button>
              </form>
            </div>
            <div class="footer-text">Anyone can reply & repost</div>
          </div>
        </div>
      `;

      const inputPostDiv = document.getElementById('input-post');
      const popupOverlay = document.getElementById('popupOverlay');

      inputPostDiv.addEventListener('click', () => {
        popupOverlay.style.display = 'flex';
      });

      createNewPost();

      const closePopup = document.getElementById('closePopup');
      closePopup.addEventListener('click', () => {
        popupOverlay.style.display = 'none';
      });
    }
  });
}

function createNewPost() {
  const createPostForm = document.getElementById('createpost');
  const popupOverlay = document.getElementById('popupOverlay');
  const errorMessage = document.getElementById('errorMessage');

  createPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(createPostForm);
    const payload = Object.fromEntries(formData);
    console.log(payload);

    errorMessage.style.display = 'none';

    axios.post('http://localhost:3000/v1/threads/', payload, {
      headers: {
        apikey: 'jenather',
        token: localStorage.getItem('token'),
      }
    })
    .then((response) => {
      console.log(response);
      if (response.data.success === true) {
        popupOverlay.style.display = 'none';
        createPostForm.reset();
        history.pushState({}, '', '/');
        window.dispatchEvent(new Event('popstate'));
      } else {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Failed to Create Post';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Failed to Create Post';
    });
  });
}
