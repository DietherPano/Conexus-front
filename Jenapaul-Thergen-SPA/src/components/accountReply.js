import axios from 'axios';
import '../styles/coneXus.css';
import '../styles/createreply.css';

export default function AddReplies(repliesContainer, post_id, parent_reply_id = null) {
  const popupOverlay = document.getElementById('popupOverlay');
  popupOverlay.innerHTML = `
    <div class="replypopup" id="replyPopup">
      <span class="close" id="closeReplyPopup">Cancel</span>
      <h2>Reply Threads</h2>

    <div class="postContentsinReply">
      <div class="header">
        <img src="${post.post_profile_image ? post.post_profile_image : '../../../icons/user.png'}" alt="Profile Picture" class="post-profile-picture">
        <h3>${post.post_username}</h3>
      </div>
      <p>${post.content}</p>
      <div class="buttons">
        <button id="iconbtn">
          <img id="icon" src="../icons/navSvg/heart-svgrepo-com.svg" alt="">
          ${post.like_count}
        </button>
        <button class="replies" id="iconbtn">
          <img id="icon" src="../icons/navSvg/comment-2-svgrepo-com.svg" alt="">
          ${post.replies_count}
        </button>
        <button id="iconbtn">
          <img id="icon" src="../icons/navSvg/repost-round-svgrepo-com.svg" alt="">
          ${post.repost_count}
        </button>
      </div>
    </div>

    <div class="replyContentsinReply">
      <div class="header">
        <img src="${post.reply_profile_image ? post.reply_profile_image : '../../../icons/user.png'}" alt="Profile Picture" class="reply-profile-picture">
        <h3>${post.reply_username}</h3>
      </div>
      <p>${post.comment_text}</p>
      <div class="buttons">
        <button class="iconbtn">
          <img src="../icons/navSvg/heart-svgrepo-com.svg" alt="">
          ${post.like_count}
        </button>
        <button class="iconbtn">
          <img src="../icons/navSvg/repost-round-svgrepo-com.svg" alt="">
          ${post.repost_count}
        </button>
      </div>
    </div>

      <div class="popup-content">
        <form enctype="multipart/form-data" id="createreplies">
          <div class="input-group">
            <div class="reply-input-container">
              <input type="text" name="comment_text" placeholder="Write your reply..." required>
              <button type="submit">Post Reply</button>
            </div>
          </div>
          <div id="errorMessage" style="display: none; color: red;">
            Failed to post reply
          </div>
        </div>
      </div>

      
          
    
    <div class="message-popup-overlay" id="popupOverlayReply" style="display: none;">
      <div class="popup" id="otpPopup">
        <span class="close" id="closeReplierPopup">&times;</span>
        <div class="popup-content">
          <p>Success!</p>
          <h3></h3>
          <button data-path="/">Continue</button>
        </div>
      </div>
    </div>
  `; 


  const createreplyForm = document.getElementById('createreplies');
  const popupOverlayReply = document.getElementById('popupOverlayReply');
  const errorMessage = document.getElementById('errorMessage');
  const closeReplyPopup = document.getElementById('closeReplyPopup');
  const closeReplierPopup = document.getElementById('closeReplierPopup');

  popupOverlay.style.display = 'block';

  createreplyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(createreplyForm);
    const payload = Object.fromEntries(formData);

    if (parent_reply_id) {
      payload.parent_reply_id = parent_reply_id;
    }

    errorMessage.style.display = 'none';

    axios.post(`http://localhost:3000/v1/account/${post_id}/reply`, payload, {
      headers: {
        apikey: 'jenather',
        token: localStorage.getItem('token'),
      }
    })
    .then((response) => {
      console.log('Response from server:', response);

      if (response.data.success === true) {

        fetchReplies(post_id).then((replies) => {
          if (repliesContainer) {
            repliesContainer.innerHTML = '';
            renderReplies(replies, repliesContainer, post_id);
          } else {
            console.error('Replies container not found');
          }
        });

        popupOverlayReply.style.display = 'block';
      } else {
        errorMessage.style.display = 'block';
        errorMessage.textContent = 'Failed to add reply';
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      errorMessage.style.display = 'block';
      errorMessage.textContent = 'Failed to add reply';
    });
  });

  closeReplyPopup.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
  });

  if (closeReplierPopup) {
    closeReplierPopup.addEventListener('click', () => {
        popupOverlayReply.style.display = 'none';
    });
  }
}


function renderReplies(replies, parentElement, post_id) {
    replies.forEach(reply => {
        const replyElement = document.createElement('div');
        replyElement.classList.add('reply');
        replyElement.innerHTML = `
            <p>${reply.comment_text}</p>
            <button onclick="AddReplies(${post_id}, ${reply.id})">Reply</button>
        `;
        parentElement.appendChild(replyElement);

        
        if (reply.children && reply.children.length > 0) {
            const nestedReplies = document.createElement('div');
            renderReplies(reply.children, nestedReplies, post_id);
            replyElement.appendChild(nestedReplies);
        }
    });
}


async function fetchReplies(post_id) {
    console.log(`Fetching replies for post ID: ${post_id}`);
    try {
        const response = await axios.get(`http://localhost:3000/v1/threads/${post_id}/reply`, {
            headers: {
                apikey: 'jenather',
                token: localStorage.getItem('token'),
            }
        });
        return response.data.replies;
    } catch (error) {
        console.error('Error fetching replies:', error);
        return [];
    }
}

      