import axios from 'axios';
import ReactionLike from '../../reaction/reactionlike';
import ReactionUnlike from '../../reaction/reactionUnlike';
import AddReplies from '../../createReplies/createreplies';
import actionRepost from '../../repost_functionality/repost';
import actionUnrepost from '../../repost_functionality/unrepost';
import addViewProfileListener from './viewProfile';
export default function RepostContents(root) {
    root.innerHTML = '';
    displayReposts(root);
}

function displayReposts(root) {
    axios.get('http://localhost:3000/v1/account/repost', {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        },
    })
    .then((response) => {
        console.log('API Response:', response);

        if (response.data.success) {
            const repostData = response.data.data;

            repostData.reverse();

            repostData.forEach((data) => {
                console.log(data.repost.content);
                console.log('original_image', data.originalPost.profile_image);
                console.log('username of previous', data.originalPost.username);
                console.log('repost',data.repost.repost_count)

                const repostContainer = document.createElement('div');
                repostContainer.setAttribute('class', 'repost-container');

                const userImg = `<img src="${data.originalPost.profile_image ? data.originalPost.original_profile_image : '../../../icons/user.png'}" alt="Profile Picture" class="post-profile-picture">`;

                repostContainer.innerHTML = `
                    ${userImg}
                    <div class="repostContents">
                        <h3>${data.originalPost.original_username}</h3>
                        <p>${data.originalPost.content}</p>
                        <button class="like" id="iconbtn" data-id="${data.originalPost.post_id}">
                            <img id="icon" src="../icons/navSvg/heart-svgrepo-com.svg" alt="">
                            <span>${data.originalPost.like_count}</span>
                        </button>
                        <button class="replies" id="iconbtn" data-id="${data.originalPost.post_id}">
                            <img id="icon" src="../icons/navSvg/comment-2-svgrepo-com.svg" alt="">
                            ${data.originalPost.replies_count}
                        </button>
                        <button class="repost" id="iconbtn" data-id="${data.originalPost.post_id}">
                            <img id="icon" src="../icons/navSvg/repost-round-svgrepo-com.svg" alt="">
                            <span class="repost-count">${data.repost.repost_count}</span
                        </button>
                    </div>
                `;

                initializeEventListeners(repostContainer, data);

                root.appendChild(repostContainer);
                addViewProfileListener()
            });
        }
    })
    .catch((error) => {
        console.error('Error fetching reposts:', error);
    });
}

function initializeEventListeners(postElement, data) {
    const repliesButton = postElement.querySelector('.replies');
    const likesButton = postElement.querySelector('.like');
    const repostButton = postElement.querySelector('.repost');

    const repliesContainer = document.getElementById('repliesContainer');
    const unlikesContainer = postElement.querySelector('.like'); 
    const likesContainer = postElement.querySelector('.like'); 
    
    likesButton.addEventListener('click', () => { 
        if (data.isLiked) {
            ReactionUnlike(unlikesContainer, data.originalPost.post_id); 
            data.isLiked = false; 
            likesButton.classList.remove('liked'); 
        } else {
            ReactionLike(likesContainer, data.originalPost.post_id);
            data.isLiked = true; 
            likesButton.classList.add('liked'); 
        }
    });


    repliesButton.addEventListener('click', () => { 
        AddReplies(repliesContainer, data.post_id, data); 
    }); 

    repostButton.addEventListener('click', () => {
        if (data.originalPost.isReposted) {
            actionUnrepost(data.originalPost.post_id, repostButton); 
            data.originalPost.isReposted = false;
        } else {
            actionRepost(data.originalPost.post_id, repostButton); 
            data.originalPost.isReposted = true;
        }
    });
}