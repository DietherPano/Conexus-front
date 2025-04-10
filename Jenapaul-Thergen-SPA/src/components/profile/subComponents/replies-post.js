import  axios from "axios";
import ReactionLike from '../../reaction/reactionlike';
import ReactionUnlike from '../../reaction/reactionUnlike';
import actionRepost from "../../repost_functionality/repost";
import actionUnrepost from "../../repost_functionality/unrepost";
import AddReplies from "../../createReplies/createreplies";
import addViewProfileListener from "../../createReplies/subComponents/viewProfile";

export default function RepliesPost(root) {
    root.innerHTML = '';
    fetchRepliesPost(root);
}

function fetchRepliesPost(root) {
    axios.get('http://localhost:3000/v1/account/replies', {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        console.log(response)
        if (response.data.success === true){
            const posts = response.data.data
            posts.forEach((post) => {
                const replyContainer = document.createElement('div');
                replyContainer.setAttribute('class', 'reply-container');
                const postContainer = document.createElement('div');
                postContainer.setAttribute('class', 'post-container');
                
                const replyImg = `<img src="${
                    post.reply_profile_image ? post.reply_profile_image : '../../../icons/user.png'
                }" alt="Profile Picture" class="reply-profile-picture">`;

                const userImg = `<img src="${
                    post.post_profile_image ? post.post_profile_image : '../../../icons/user.png'
                }" alt="Profile Picture" class="post-profile-picture">`;
        
                postContainer.innerHTML = `
                    ${userImg}
                    <div class="postContents">
                        <h3 class="user-profile2" data-userId="${post.post_user_id}">${post.post_username}</h3>
                        <p>${post.content}</p>
                        <button class="like" id="iconbtn">
                            <img id="icon" src="../icons/navSvg/heart-svgrepo-com.svg" alt="">
                            ${post.like_count}
                        </button>
                        <button class="replies" id="iconbtn">
                            <img id="icon" src="../icons/navSvg/comment-2-svgrepo-com.svg" alt="">
                            ${post.replies_count}
                        </button>
                        <button class="repost" id="iconbtn">
                            <img id="icon" src="../icons/navSvg/repost-round-svgrepo-com.svg" alt="">
                            <span class="repost-count">${post.repost_count}</span>
                        </button>
                    </div>
                `;
                replyContainer.innerHTML =`
                    ${replyImg}
                    <div class="replyContents">
                        <h3 class="user-profile2" data-userId="${post.reply_user_id}">${post.reply_username}</h3>
                        <p>${post.comment_text}</p>
                        <div class="reply-actions">
                            <button class="iconbtn">
                                <img src="../icons/navSvg/heart-svgrepo-com.svg" alt="">
                                ${post.like_count}
                            </button>

                            <button class="iconbtn">
                                <img id="icon" src="../icons/navSvg/comment-2-svgrepo-com.svg" alt="">
                                ${post.replies_count}
                            </button>
                        </div>
                    </div>
                `;

                initializeEventListeners(postContainer, post);
                root.appendChild(postContainer);
                root.appendChild(replyContainer);
                addViewProfileListener()

                
        });
        }
    })
}

function initializeEventListeners(postElement, post) {
    const repliesButton = postElement.querySelector('.replies');
    const likesButton = postElement.querySelector('.like');
    const repostButton = postElement.querySelector('.repost');

    const repliesContainer = document.getElementById('repliesContainer');
    const unlikesContainer = postElement.querySelector('.like'); 
    const likesContainer = postElement.querySelector('.like'); 

    likesButton.addEventListener('click', () => { 
        if (post.isLiked) {
            ReactionUnlike(unlikesContainer, post.post_id); 
            post.isLiked = false; 
            likesButton.classList.remove('liked'); 
        } else {
            ReactionLike(likesContainer, post.post_id);
            post.isLiked = true; 
            likesButton.classList.add('liked'); 
        }
    });


    repliesButton.addEventListener('click', () => { 
        AddReplies(repliesContainer, post.post_id, post); 
    }); 
   
    repostButton.addEventListener('click', () => {
        if (post.isReposted) {
            actionUnrepost(post.post_id, repostButton); 
            post.isReposted = false;
        } else {
            actionRepost(post.post_id, repostButton); 
            post.isReposted = true;
        }
    });
}
