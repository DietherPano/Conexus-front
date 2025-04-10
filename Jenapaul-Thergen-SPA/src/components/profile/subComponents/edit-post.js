import '../../../styles/createPost.css';
import '../../../components/header';

import axios from 'axios';

export default function editPost(root, post_id) {
  axios
    .patch(`http://localhost:3000/v1/threads/${post_id}`, {}, {
      headers: {
        apikey: 'jenather',
        token: localStorage.getItem('token'),
      },
    })
    .then((response) => {
      if (response.data.success) {
        const data = response.data.data;

        root.innerHTML = `
          <div id="editinput-post">
            <h2>Edit Post</h2>
            <form id="createpost">
              <textarea id="postContent" name="content" placeholder="Edit your post...">${data.content}</textarea>
              <button type="submit">Save Changes</button>
              <button type="button" id="closePopup">Cancel</button>
            </form>
            <div id="errorMessage" style="display: none; color: red;"></div>
          </div>
          <div id="popupOverlay" style="display: none;"></div>
        `;

        const popupOverlay = document.getElementById('popupOverlay');
        popupOverlay.style.display = 'flex';

        const closePopup = document.getElementById('closePopup');
        closePopup.addEventListener('click', () => {
          popupOverlay.style.display = 'none';
        });

        createNewedit(post_id, popupOverlay);
      }
    })
    .catch((error) => {
      console.error('Error fetching post data for editing:', error);
    });
}

function createNewedit(post_id, popupOverlay) {
  const createPostForm = document.getElementById('createpost');
  const errorMessage = document.getElementById('errorMessage');

  if (!createPostForm) {
    console.error('Form element not found');
    return;
  }

  createPostForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(createPostForm);
    const payload = Object.fromEntries(formData);

    errorMessage.style.display = 'none';

    axios
      .patch(`http://localhost:3000/v1/threads/${post_id}/`, payload, {
        headers: {
          apikey: 'jenather',
          token: localStorage.getItem('token'),
        },
      })
      .then((response) => {
        if (response.data.success) {
          popupOverlay.style.display = 'none';
          createPostForm.reset();
          history.pushState({}, '', '/');
          window.dispatchEvent(new Event('popstate'));
        } else {
          errorMessage.style.display = 'block';
          errorMessage.textContent = 'Failed to update the post.';
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Failed to update the post.';
      });
  });
}
