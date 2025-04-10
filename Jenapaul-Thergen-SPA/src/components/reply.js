// import '../styles/createreply.css'


// export default function createReply(root, data, postData) {
//     root.innerHTML = `
//       <div class="post-container">
//         <div class="post-header">
//           <img src="${data.profile_img ? data.profile_img : '../../icons/user.png'}" alt="Profile Picture" class="post-profile-picture">
//           <h1 class="username">${postData.username}</h1>
//         </div>
//         <p class="post-content">${postData.content}</p>
//         <div class="post-actions">
//           <button class="action-button">
//             <img src="../icons/navSvg/heart-svgrepo-com.svg" alt="Like" class="icon">
//             <span>${postData.like_count}</span>
//           </button>
//           <button class="action-button">
//             <img src="../icons/navSvg/comment-2-svgrepo-com.svg" alt="Comment" class="icon">
//             <span>${postData.replies_count}</span>
//           </button>
//           <button class="action-button">
//             <img src="../icons/navSvg/repost-round-svgrepo-com.svg" alt="Repost" class="icon">
//             <span>${postData.repost_count}</span>
//           </button>
//         </div>
//       </div>
  
//       <div class="create-reply">
//         <form enctype="multipart/form-data" id="createreplies">
//           <input type="text" id="text" name="comment_text" placeholder="Write a reply..." required>
//           <span id="errorMessage" class="error-message" style="display: none;"></span>
//           <button class="post-button" type="submit">Send</button>
//         </form>
//       </div>
  
//       <div class="message-popup-overlay" id="popupOverlay" style="display: none;">
//         <div class="popup" id="popup">
//           <span class="close" id="closePopup">&times;</span>
//           <div class="popup-content">
//             <p>Thank you for your reply!</p>
//             <h3>Check Your Inbox</h3>
//             <button id="continueBtn">Continue</button>
//           </div>
//         </div>
//       </div>
  
//       <div class="message-popup-overlay" id="contentError" style="display: none;">
//         <div class="popup" id="popupError">
//           <span class="close" id="closeErrorPopup">&times;</span>
//           <div class="popup-content">
//             <p>Failed to send your reply.</p>
//             <h3>Please try again.</h3>
//             <button data-post="/">Retry</button>
//           </div>
//         </div>
//       </div>
//     `;

//     const createreplyForm = document.getElementById('createreplies');
//     const errorMessage = document.getElementById('errorMessage');
  
  
//     popupOverlay.style.display = 'block';
  
//     createreplyForm.addEventListener('submit', (e) => {
//         e.preventDefault();
//         const formData = new FormData(createreplyForm);
//         const payload = Object.fromEntries(formData);
  
//         if (parent_reply_id) {
//             payload.parent_reply_id = parent_reply_id;
//         }
  
//         errorMessage.style.display = 'none';
  
//         axios.post(`http://localhost:3000/v1/threads/${post_id}/reply`, payload, {
//             headers: {
//                 apikey: 'jenather',
//                 token: localStorage.getItem('token'),
//             }
//         })
//         .then((response) => {
//             console.log('Response from server:', response);
//             if (response.data.success === true) {
//                 fetchReplies(post_id).then(replies => {
//                     if (repliesContainer){
//                     repliesContainer.innerHTML = '';
//                     renderReplies(replies, repliesContainer, post_id);}
//                       else {
//                           console.error('replies container not found');
//                       }
//                 });
               
//                 popupOverlay.style.display = 'none';
//             } else {
//                 errorMessage.style.display = 'block';
//                 errorMessage.textContent = 'Failed to add reply';
//             }
//         })
//         .catch((error) => {
//             console.error('Error:', error);
//             errorMessage.style.display = 'block';
//             errorMessage.textContent = 'Replies failed to add';
//         });
//     });
  
   
//     document.getElementById('closeReplyPopup').addEventListener('click', () => {
//         popupOverlay.style.display = 'none';
//     });
//   }
  
//   function renderReplies(replies, parentElement, post_id) {
//       replies.forEach(reply => {
//           const replyElement = document.createElement('div');
//           replyElement.classList.add('reply');
//           replyElement.innerHTML = `
//               <p>${reply.comment_text}</p>
//               <button onclick="AddReplies(${post_id}, ${reply.id})">Reply</button>
//           `;
//           parentElement.appendChild(replyElement);
  
          
//           if (reply.children && reply.children.length > 0) {
//               const nestedReplies = document.createElement('div');
//               renderReplies(reply.children, nestedReplies, post_id);
//               replyElement.appendChild(nestedReplies);
//           }
//       });
//   }
  
  
//   async function fetchReplies(post_id) {
//       console.log(`Fetching replies for post ID: ${post_id}`);
//       try {
//           const response = await axios.get(`http://localhost:3000/v1/threads/${post_id}/reply`, {
//               headers: {
//                   apikey: 'jenather',
//                   token: localStorage.getItem('token'),
//               }
//           });
//           return response.data.replies;
//       } catch (error) {
//           console.error('Error fetching replies:', error);
//           return [];
//       }
//   }
  