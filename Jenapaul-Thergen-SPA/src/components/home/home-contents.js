import axios from 'axios';
import '../../styles/contents.css';
import CreatePost from "./subComponents/createpost";
import AddReplies from '../createReplies/createreplies';
import Unfollow from '../search/followFunction/unfollow';
import Follow from '../search/followFunction/follow';
import ReactionLike from '../reaction/reactionlike';
import ReactionUnlike from '../reaction/reactionUnlike';
import actionRepost from '../repost_functionality/repost';
import actionUnrepost from '../repost_functionality/unrepost';
import RepliesPost from '../search/fetch/fetchRepliesWithPost';
import RepostContents from '../fetchRepost';

export default function Contents(root) {
    root.innerHTML = `
        <div class="home-container">
            <div id="creatorPost"></div>
            <div id="contents"></div>
            <div id="popUpProfile"></div>
            <button id="post-button">+</button>
        </div>`;

    const creatorPost = document.getElementById('creatorPost');
    const newCreatorPost = document.createElement('div');
    newCreatorPost.setAttribute('class', 'create-post-container');
    CreatePost(newCreatorPost);
    creatorPost.appendChild(newCreatorPost);
    fetchPost();

    if (document.body.classList.contains('dark-mode')) {
        document.querySelectorAll('.home-container, #contents, .post-container, #post-button').forEach(el => {
            el.classList.add('dark-mode');
        });
    }
}

function addPostListener(){
    const postButton = document.getElementById('post-button');
    const postButtonNav = document.getElementById('post')
    const popupOverlay = document.getElementById('popupOverlay');
    postButtonNav.addEventListener('click', () => {
        popupOverlay.style.display = 'flex'
    })
    postButton.addEventListener('click', () => {
        popupOverlay.style.display = 'flex';
    })
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
        addViewProfileListener()
    });
    addPostListener()
}

function createPostElement(postData) {
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

function addViewProfileListener() {
    const popUp = document.getElementById('popUpProfile');

    
    const profiles = document.querySelectorAll('.user-profile');

    profiles.forEach(profile => {
        if (profile.hasAttribute('data-listener-attached')) return;

        profile.addEventListener('click', (e) => {
            popUp.style.display = 'block';
            const userId = parseInt(e.target.getAttribute('data-userid'), 10);
            fetchViewProfile(userId);
        });

        profile.setAttribute('data-listener-attached', 'true');
    });
}

function fetchViewProfile(userId){
    axios.get(`http://localhost:3000/v1/account/profile/${userId}`, {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        if (response.data.success === true){
            if (response.data.redirectToProfile){
                history.pushState({}, '', '/profile');
                window.dispatchEvent(new Event('popstate'));
            } else {
                const data = response.data.data
                console.log(response)
                createViewProfileElement(data)
                attachFollowUnfollowListener()
            }
        }
    })
}

function createViewProfileElement(data) {
    const contents = document.getElementById('popUpProfile');
    const buttonText = data.is_following === 1 ? 'Unfollow' : 'Follow'
    const buttonClass = data.is_following === 1 ? 'unfollow-button' : 'follow-button';
    contents.innerHTML = `<div class="profile-container">
                    <div class="profile-header">
                        <div class="profile-details">
                            <button id="close-button">x</button>
                            <h1>${data.username}</h1>
                            <p>${data.fullname}</p>
                            <div>BIO</div>
                            <span>${data.bio ? data.bio : ''}</span>
                        </div>
                        <div>
                            <img src="${data.profile_img ? data.profile_img : '../../icons/user.png'}" class="profile-picture" alt="profile">
                        </div>
                    </div>
                    <button class="${buttonClass}" id="follow-button" data-userid="${data.id}">${buttonText}</button>
                    <div class="tabs">
                        <button class="tab-button active" id="threads-tab">Threads</button>
                        <button class="tab-button" id="replies-tab">Replies</button>
                        <button class="tab-button" id="reposts-tab">Reposts</button>
                    </div>
                    <div id="profile-contents"></div>
                    <button id="post-button">+</button>
                </div>`;
    const closeButton = document.getElementById('close-button');
    closeButton.addEventListener('click', () => {
        contents.style.display = 'none';
    });

    
    const contentss = document.getElementById('profile-contents');
    fetchAccountPost(contentss, data.id);

            // Threads Tab
    const threadsTab = document.getElementById('threads-tab');
    threadsTab.addEventListener('click', () => {
        fetchAccountPost(contentss, data.id);
    });

            // Replies Tab
    const repliesTab = document.getElementById('replies-tab');
    repliesTab.addEventListener('click', () => {
        RepliesPost(contentss, data.id);
    });

            // Reposts Tab
    const repostsTab = document.getElementById('reposts-tab');
    repostsTab.addEventListener('click', () => {
        RepostContents(contentss, data.id);
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.tab-button.active').classList.remove('active');
            button.classList.add('active');
        });
    });
}

function initializeEventListeners(postElement, postData) {
    const repliesButton = postElement.querySelector('.replies');
    const likesButton = postElement.querySelector('.like');
    const repostButton = postElement.querySelector('.repost');

    const repliesContainer = document.getElementById('repliesContainer');
    const unlikesContainer = postElement.querySelector('.like'); 
    const likesContainer = postElement.querySelector('.like'); 
    
    repliesButton.addEventListener('click', () => { 
        AddReplies(repliesContainer, postData.post_id, postData); 
    });

    likesButton.addEventListener('click', () => { 
        if (postData.isLiked) {
            ReactionUnlike(likesButton, postData.post_id); 
            postData.isLiked = false; 
            likesButton.classList.remove('liked'); 
        } else {
            ReactionLike(likesButton, postData.post_id);
            postData.isLiked = true; 
            likesButton.classList.add('liked'); 
        }
    });

    repostButton.addEventListener('click', () => {
        if (postData.isReposted) {
            actionUnrepost(postData.post_id, repostButton); // Call Unrepost
            postData.isReposted = false;
        } else {
            actionRepost(postData.post_id, repostButton); // Call Repost
            postData.isReposted = true;
        }
    });
}


function fetchAccountPost(root,userId) {
    console.log(userId)
    root.innerHTML = ''
    axios.get(`http://localhost:3000/v1/account/profile/post/${userId}`, {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        },
    })
    .then((response) => {
        if (response.data.success) {
            console.log(response)
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


function attachFollowUnfollowListener(){
    const followBtn = document.querySelectorAll('.follow-button, .unfollow-button')
    followBtn.forEach(button => {
        button.addEventListener('click', (e) => {
            const userId = parseInt(e.target.getAttribute('data-userid'), 10)
            const isFollowing = button.classList.contains('unfollow-button');

            if (isFollowing){
                Unfollow(userId, button)
            } else {
                Follow(userId, button)
            }
        })
    })
}
