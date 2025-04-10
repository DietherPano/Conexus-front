import axios from 'axios';
import '../../styles/coneXus.css';
import '../../styles/createreply.css';

import addViewProfileListener from './subComponents/viewProfile';
import ReactionLike from '../reaction/reactionlike';
import ReactionUnlike from '../reaction/reactionUnlike';
import actionRepost from "../repost_functionality/repost";
import actionUnrepost from "../repost_functionality/unrepost";

export default function AddReplies(repliesContainer, post_id, postData) {
  const popupOverlay = document.getElementById('popupOverlay');

  popupOverlay.innerHTML = `
    <div class="replypopup" id="replyPopup">
      <span class="close" id="closeReplyPopup">Cancel</span>
      <h2>Reply Threads</h2>

    <div class="postContentsinReply">
      <div class="header">
        <img src="${postData.profile_image ? postData.profile_image : '../../../icons/user.png'}" alt="Profile Picture" class="post-profile-picture">
        <h3 class="user-profile2" data-userId="${postData.user_id}">${postData.username ? postData.username : postData.original_username}</h3>
      </div>
      <p>${postData.content}</p>
      <div class="buttons">
        <button class="like" id="iconbtn">
          <img id="icon" src="../icons/navSvg/heart-svgrepo-com.svg" alt="">
          ${postData.like_count}
          
        </button>
        <button class="replies" id="iconbtn">
          <img id="icon" src="../icons/navSvg/comment-2-svgrepo-com.svg" alt="">
          ${postData.replies_count}
        </button>
        <button class="repost" id="iconbtn">
          <img id="icon" src="../icons/navSvg/repost-round-svgrepo-com.svg" alt="">
          ${postData.repost_count}
        </button>
      </div>
    </div>

    <div class="replyContentsinReply" id="replyContentsinReply">
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
        </form>
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
  addViewProfileListener();
  

  popupOverlay.style.display = 'block';


  const closeReplyPopup = document.getElementById('closeReplyPopup');
  closeReplyPopup?.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
    popupOverlay.innerHTML = '';
  });

  fetchReplyByPostId(post_id);
  // fetchLikes(post_id);

  const postElement = popupOverlay.querySelector('.postContentsinReply');
  initializeEventListeners(postElement, postData);

  // Form submission handling
  const replyForm = document.getElementById('createreplies');
  replyForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(replyForm);
    const payload = Object.fromEntries(formData);

    try {
      const response = await axios.post(`http://localhost:3000/v1/threads/${post_id}/reply`, payload, {
        headers: {
          apikey: 'jenather',
          token: localStorage.getItem('token'),
        },
      });

      if (response.data.success) {
     
        const repliesContainer = document.getElementById('replyContentsinReply');
        fetchReplies(post_id).then((replies) => {
          if (repliesContainer) {
            repliesContainer.innerHTML = '';
            renderReplies(replies, repliesContainer, post_id);
          }
        });

        fetchPost();

        // Close the reply popup
        closeReplyPopup?.click();
      } else {
        throw new Error(response.data.message || 'Failed to post reply');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = document.getElementById('errorMessage');
      errorMessage.style.display = 'block';
      errorMessage.textContent = error.message;
    }
  });
}

function fetchPost(){
  axios.get('http://localhost:3000/v1/',{
      headers: {
          apikey: 'jenather',
      }
  })
  .then((response) => {
      console.log(response.data.data.result)
      if (response.data.success === true) {
          renderPosts(response.data.data.result);
      }
  })
  .catch((error) => {
      console.error('Error fetching posts:', error);
  });
}


function renderPosts(posts) { 
  const postContainer = document.getElementById('contents');
  postContainer.innerHTML = '';
  posts.forEach(postData => {
      const allPost = createPostElement(postData);
      postContainer.appendChild(allPost);
  });

}

function createPostElement(postData) {
  console.log("Nigga",postData)
  const allPost = document.createElement('div');
  allPost.setAttribute('class', 'post-container');

  const userImg = `<img src="${postData.profile_image || '../../icons/user.png'}" alt="Profile Picture" class="post-profile-picture">`;
  allPost.innerHTML = `
      ${userImg}
      <div class="postContents">
          <h3 class="user-profile" data-userId="${postData.user_id}">${postData.username}</h3>
          <p>${postData.content}</p>
          <button class="like" id="iconbtn">
              <img id="icon" src="../icons/navSvg/heart-svgrepo-com.svg" alt="">
              ${postData.like_count}
          </button>
          <button class="replies" id="iconbtn" data-post-id="${postData.post_id}">
              <img id="icon" src="../icons/navSvg/comment-2-svgrepo-com.svg" alt="">
              <span>${postData.replies_count}</span>
          </button>
          <button class="repost" id="iconbtn" data-post-id="${postData.post_id}">
              <img id="icon" src="../icons/navSvg/repost-round-svgrepo-com.svg" alt="">
              <span class="repost-count">${postData.repost_count}</span>
          </button>
          
          

      </div>`;

  initializeEventListeners(allPost, postData);

  return allPost;
}
function initializeEventListeners(postElement, postData) {
  const repliesButton = postElement.querySelector('.replies');
  const likesButton = postElement.querySelector('.like');
  const repostButton = postElement.querySelector('.repost');

  const repliesContainer = document.getElementById('repliesContainer');
  const unlikesContainer = postElement.querySelector('.like'); 
  const likesContainer = postElement.querySelector('.like'); 
  const repostContainer = document.getElementById('repostsContainer');
  const unrepostContainer = document.getElementById('unrepostsContainer');

  likesButton.addEventListener('click', () => { 
      if (postData.isLiked) {
          ReactionUnlike(unlikesContainer, postData.post_id); 
          postData.isLiked = false; 
          likesButton.classList.remove('liked'); 
      } else {
          ReactionLike(likesContainer, postData.post_id);
          postData.isLiked = true; 
          likesButton.classList.add('liked'); 
          
      }
  });

  repliesButton.addEventListener('click', () => { 
      AddReplies(repliesContainer, postData.post_id, postData); 
  });

  repostButton.addEventListener('click', () => {
      if (postData.isrepost) {
          actionUnrepost(unrepostContainer, postData.post_id);
          postData.isrepost = false;
          repostButton.classList.remove('reposted'); 
      } else {
          actionRepost(repostContainer, postData.post_id);
          postData.isrepost = true; 
          repostButton.classList.add('reposted'); 
      }
  });
  

}

// function fetchLikes(post_id){
//   axios.get(`http://localhost:3000/v1/threads/${post_id}/likes`, {
//     headers: {
//       apikey: 'jenather',
//       token: localStorage.getItem('token'),
//     }
//   })
//   .then((response) => {
//     if (response.data.success){
//       const data = response.data.likes
//       renderLikes(data)
//     }
//   })
// }

// function renderLikes(data){
//   const likeTooltip = document.getElementById('likeTooltip');
//   console.log(data)
//   data.forEach(like => {
//     const container = document.createElement('p')
//     container.innerHTML = `<span>${data.username}</span>`
//     likeTooltip.appendChild(container)
//   })
//   // likeButton.addEventListener('mouseover', () => {
//   //   if (likesData.length > 0) {
//   //     likeTooltip.innerHTML = '';
//   //     likesData.forEach(user => {
//   //       const userItem = document.createElement('div');
//   //       userItem.textContent = user.username;
//   //       userItem.classList.add('tooltip-item');
//   //       likeTooltip.appendChild(userItem);
//   //     });
//   //     likeTooltip.classList.remove('hidden');
//   //   } else {
//   //     likeTooltip.textContent = 'No likes yet.';
//   //     likeTooltip.classList.remove('hidden');
//   //   }
//   // });

//   // likeButton.addEventListener('mouseleave', () => {
//   //   likeTooltip.classList.add('hidden');
//   // });
// }

function fetchReplyByPostId(post_id){
  const replies = document.getElementById('replyContentsinReply');
  axios.get(`http://localhost:3000/v1/threads/${post_id}/reply`, {
    headers: {
      apikey: 'jenather',
      token: localStorage.getItem('token'),
    }
  })
  .then((response) => {
    if (response.data.success === true){
      const data = response.data.data.result
      console.log(data)
      data.forEach(reply => {
        const header = document.createElement('div')
        header.innerHTML = `<div class="header">
        <img src="${reply.profile_image ? reply.profile_image : '../../../icons/user.png'}" alt="Profile Picture" class="reply-profile-picture">
        <h3 class="user-profile2" data-userId="${reply.user_id}">${reply.username}</h3>
      </div>
      <p>${reply.comment_text}</p>
      <div class="buttons">
        <button class="like" id="iconbtn">
        <img id="icon" src="../icons/navSvg/heart-svgrepo-com.svg" alt="">
          ${reply.reply_likes_count}
        </button>
        <button class="repost" id="iconbtn">
          <img id="icon" src="../icons/navSvg/repost-round-svgrepo-com.svg" alt="">
          ${reply.repost_count}
        </button>
      </div>`
        replies.appendChild(header)
        addViewProfileListener()
      })
    }
  })
}

// Render replies recursively
function renderReplies(replies, parentElement, post_id) {
  replies.forEach((reply) => {
    const replyElement = document.createElement('div');
    replyElement.classList.add('reply');
    replyElement.innerHTML = `
      <div class="reply-header">
        <img src="${reply.profile_image || '../../icons/user.png'}" alt="Profile Picture" class="reply-profile-picture">
        <h4>${reply.username}</h4>
      </div>
      <p>${reply.comment_text}</p>
      <button class="nested-reply-button" data-reply-id="${reply.id}">Reply</button>
    `;

    parentElement.appendChild(replyElement);

    if (reply.children && reply.children.length > 0) {
      const nestedReplies = document.createElement('div');
      nestedReplies.classList.add('nested-replies');
      renderReplies(reply.children, nestedReplies, post_id);
      replyElement.appendChild(nestedReplies);
    }

    // Event listener for nested replies
    const nestedReplyButton = replyElement.querySelector('.nested-reply-button');
    nestedReplyButton?.addEventListener('click', () => {
      AddReplies(parentElement, post_id, {
        profile_image: reply.profile_image,
        username: reply.username,
        content: reply.comment_text,
      });
    });
  });
}

// Fetch replies for a post
async function fetchReplies(post_id) {
  try {
    const response = await axios.get(`http://localhost:3000/v1/threads/${post_id}/reply`, {
      headers: {
        apikey: 'jenather',
        token: localStorage.getItem('token'),
      },
    });
    return response.data.replies || [];
  } catch (error) {
    console.error('Error fetching replies:', error);
    return [];
  }
}
