import axios from 'axios';
import ReactionLike from '../../reaction/reactionlike';
import ReactionUnlike from '../../reaction/reactionUnlike';
import actionRepost from '../../repost_functionality/repost';
import actionUnrepost from '../../repost_functionality/unrepost';
import AddReplies from '../../createReplies/createreplies';
import DeletePost from './delete-post';
import editPost from './edit-post';

export default function AccountPost(root) {
    root.innerHTML = '';
    fetchAccountPost(root);
}

function fetchAccountPost(root) {
    axios.get('http://localhost:3000/v1/account/post', {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        },
    })
    .then((response) => {
        if (response.data.success) {
            const newData = response.data.data.result;

            newData.forEach((data) => {
                const accountPost = document.createElement('div');
                accountPost.setAttribute('class', 'post-container');

                const userImg = `
                    <img src="${data.profile_image ? data.profile_image : '../../../icons/user.png'}" 
                    alt="Profile Picture" class="post-profile-picture">
                `;

                accountPost.innerHTML = `
                ${userImg}
                <div class="postContents">
                    <h3>${data.username}</h3>
                    <p>${data.content}</p>
                    <button class="like" id="iconbtn">
                        <img id="icon" src="../icons/navSvg/heart-svgrepo-com.svg" alt="">
                        ${data.like_count}
                    </button>
                    <button class="replies" id="iconbtn">
                        <img id="icon" src="../icons/navSvg/comment-2-svgrepo-com.svg" alt="">
                        ${data.replies_count}
                    </button>
                    <button class="repost" id="iconbtn">
                        <img id="icon" src="../icons/navSvg/repost-round-svgrepo-com.svg" alt="">
                        <span class="repost-count">${data.repost_count}</span>
                    </button>
                    <button class="edit" id="iconbtn">
                        <img id="icon" src="../icons/navSvg/edit-3-svgrepo-com.svg" alt="">
                    </button>
                    <form id="editcontent" style="display: none;">
                            <textarea id="postContent" name="content" placeholder="Edit your post...">${data.content}</textarea>
                            <button type="submit">Confirm</button>
                        </form>
                    <button class="delete" id="iconbtn">
                        <img id="icon" src="../icons/navSvg/delete-left-svgrepo-com.svg" alt="">
                    </button>
                </div>
                `;

                // Attach event listeners to the created buttons
                initializeEventListeners(accountPost, data);

                // Append the post to the root container
                root.appendChild(accountPost);
                
            });
        }
    })
    .catch((error) => {
        console.error('Error fetching account posts:', error);
    });
}

function initializeEventListeners(postElement, data) {
    const likesButton = postElement.querySelector('.like');
    const repliesButton = postElement.querySelector('.replies');
    const repostButton = postElement.querySelector('.repost');
    const deleteButton = postElement.querySelector('.delete');
    const editButton = postElement.querySelector('.edit');

    const repliesContainer = document.getElementById('repliesContainer');
    const unlikesContainer = postElement.querySelector('.like'); 
    const likesContainer = postElement.querySelector('.like'); 
    const deleteContainer = document.getElementById('deleteContainer');
    const editContainer = document.getElementById('editContainer');

    likesButton.addEventListener('click', () => { 
        if (data.isLiked) {
            ReactionUnlike(unlikesContainer, data.post_id); 
            data.isLiked = false; 
            likesButton.classList.remove('liked'); 
        } else {
            ReactionLike(likesContainer, data.post_id);
            data.isLiked = true; 
            likesButton.classList.add('liked');  
        }
    });


    repliesButton.addEventListener('click', () => { 
        AddReplies(repliesContainer, data.post_id, data); 
    }); 

    // Handle repost button
    repostButton.addEventListener('click', () => {
        if (data.isReposted) {
            actionUnrepost(data.post_id, repostButton); 
            data.isReposted = false;
        } else {
            actionRepost(data.post_id, repostButton); 
            data.isReposted = true;
        }
    });

    deleteButton.addEventListener('click', () => { 
        DeletePost(deleteContainer, data.post_id); 
        history.pushState(null, null, window.location.href);
        window.dispatchEvent(new PopStateEvent('popstate')); 
    }); 

    editButton.addEventListener('click', () => { 
        editPost(editContainer, data.post_id);
        
    }); 

}