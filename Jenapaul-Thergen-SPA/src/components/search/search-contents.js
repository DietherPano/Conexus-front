import '../../styles/search-contents.css';
import Follow from './followFunction/follow';
import Unfollow from './followFunction/unfollow';
import ReactionLike from '../reaction/reactionlike';
import ReactionUnlike from '../reaction/reactionUnlike';
import RepliesPost from './fetch/fetchRepliesWithPost';
import RepostContents from '../fetchRepost';
import actionRepost from '../repost_functionality/repost';
import actionUnrepost from '../repost_functionality/unrepost';
import AddReplies from '../createReplies/createreplies';
import axios from 'axios';

export default function SearchContents(root) {
    console.log('Rendering SearchContents...');
    root.innerHTML = `
        <div class="search-container">
            <div id="search-bar"></div>
            <div id="foryou"></div>
            <div id="search-contents"></div>
        </div>
        <div id="popUpProfile"></div>
        <div class="newPost-popUp-overLay" id="popupOverlay" style="display: none;"></div>
    `;

    const searchBar = document.getElementById('search-bar');
    const searchBarContainer = document.createElement('div');
    searchBarContainer.classList.add('search-bar-container');
    createSearchBar(searchBarContainer);
    searchBar.appendChild(searchBarContainer);

    fetchFollowSuggestions();
    fetchTopUseHashtags();
}

function fetchTopUseHashtags(){
    axios.get('http://localhost:3000/v1/threads/hashtags', {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        if (response.data.success === true){
            const data = response.data.data.result;
            renderTopUseHashtags(data)      
        }
    })
}

function renderTopUseHashtags(data){
    const contents = document.getElementById('foryou') 
    contents.innerHTML = ''
    data.forEach(hashtags => {
         if (hashtags.usage_count > 5){
            const topUseHashtags = createTopUseHashtagsElement(hashtags)
            contents.appendChild(topUseHashtags);
         }
    })
    attachHashtagClickListener()
}

function createTopUseHashtagsElement(data){
    console.log(data)
    const topHashtags = document.createElement('div')
    topHashtags.setAttribute('class', 'top-hashtags');
    topHashtags.setAttribute('data-hashtag', data.hashtag_text)
    topHashtags.innerHTML = `
        <h3> ${data.hashtag_text} </h3>
    `
    return topHashtags
}

function attachHashtagClickListener(){
    const hashtagElements = document.querySelectorAll('.top-hashtags');
    hashtagElements.forEach(hashtagElement => {
        hashtagElement.addEventListener('click', (e) => {
            const hashtagText = e.currentTarget.getAttribute('data-hashtag');
            if (hashtagText) {
                const searchInput = document.querySelector('.search-input');
                if (searchInput) {
                    searchInput.value = hashtagText;
                }
                performSearch(hashtagText);
            }
        });
    });
}

function performSearch(query) {
    axios.get(`http://localhost:3000/v1/search?query=${encodeURIComponent(query)}`, {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        console.log(response);
        if (response.data.success === true) {
            const data = response.data.data;
            fetchSearch(data);
        }
    })
    .catch((error) => {
        console.error('Search failed:', error);
    });
}

function createSearchBar(root) {
    root.innerHTML = `
        <div class="search-bar">
            <img id="searchicon" src="../icons/navSvg/search-svgrepo-com.svg" alt="Search Icon">
            <form id="search">
                <input type="text" name="search" class="search-input" placeholder="Search" aria-label="Search">
            </form>
        </div>
    `;
    
    const form = root.querySelector('#search')
    if (form){
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const query = formData.get('search');
            if (query) {
                axios.get(`http://localhost:3000/v1/search?query=${encodeURIComponent(query)}`, {
                    headers: {
                        apikey: 'jenather',
                        token: localStorage.getItem('token'),
                    }
                })
                .then((response) => {
                    console.log(response);
                    if (response.data.success === true) {
                        const data = response.data.data
                        fetchSearch(data)
                    }
                })
                .catch((error) => {
                    console.error('Search failed:', error);
                });
            }
        })
    }
}

function fetchSearch(data){
    const contents = document.getElementById('search-contents')
    const foryouContents = document.getElementById('foryou')
    foryouContents.innerHTML = ''
    contents.innerHTML = ''
    console.log(data)
    data.users.forEach(search => {
        if (search.length !== 0){
            const users = document.createElement('div');
            users.setAttribute('class','follow-suggestions');

            const buttonText = search.is_following === 1 ? 'Unfollow' : 'Follow'
            const buttonClass = search.is_following === 1 ? 'unfollow-button' : 'follow-button';

            const followButton = search.loginUserId === 1 ? '' : `<button class="${buttonClass}" data-userid="${search.user_id}">${buttonText}</button>`
            users.innerHTML = `
                <ul class="suggestions-list">
                    <li class="suggestion-item">
                        <div class="profile-info">
                            <img src='${search.profile_image ? search.profile_image : '../icons/navSvg/user-svgrepo-com.svg'}' class="search-profile-icon" alt="profile-icon">
                            <div>
                                <h3 class="user-profile" data-userId="${search.user_id}">${search.username}</h3>
                                <p>${search.fullname}</p>
                                <p>${search.followers_count} followers</p>
                            </div>
                        </div>
                        ${followButton}
                    </li>
                </ul>`
            contents.appendChild(users)
            addViewProfileListener();
        }
    });

    attachFollowUnfollowListener();

    data.posts.forEach(search => {
        if (search.length !== 0){
            const searchPost = document.createElement('div');
            searchPost.setAttribute('class', 'post-container');

            const userImg = `<img src="${search.profile_image || '../../icons/user.png'}" alt="Profile Picture" class="post-profile-picture">`;
            searchPost.innerHTML = `
                ${userImg}
                <div class="postContents">
                    <h3 class="user-profile" data-userId="${search.user_id}">${search.username}</h3>
                    <p>${search.content}</p>
                    <button class="like" id="iconbtn">
                        <img id="icon" src="../icons/navSvg/heart-svgrepo-com.svg" alt="">
                        ${search.like_count}
                    </button>
                    <button class="replies" id="iconbtn">
                        <img id="icon" src="../icons/navSvg/comment-2-svgrepo-com.svg" alt="">
                        ${search.replies_count}
                    </button>
                    <button class="repost" id="iconbtn">
                        <img id="icon" src="../icons/navSvg/repost-round-svgrepo-com.svg" alt="">
                        <span class="repost-count">${search.repost_count}</span
                    </button>
                </div>`;
            contents.appendChild(searchPost)
            addViewProfileListener();
            initializeEventListeners(searchPost, search)
        }
    })
    if (data.users.length === 0 && data.posts.length === 0){
        const noResult = document.createElement('div');
        noResult.setAttribute('class', 'noResult-container');
        noResult.innerHTML = `<h1>No Result Found</h1>`
        contents.appendChild(noResult)
    }
}

function initializeEventListeners(searchPost, search) {
    const repliesButton = searchPost.querySelector('.replies');
    const likesButton = searchPost.querySelector('.like');
    const repostButton = searchPost.querySelector('.repost');

    const repliesContainer = document.getElementById('repliesContainer');
    const unlikesContainer = searchPost.querySelector('.like'); 
    const likesContainer = searchPost.querySelector('.like'); 
    const repostContainer = document.getElementById('repostsContainer');
    const unrepostContainer = document.getElementById('unrepostsContainer');

    likesButton.addEventListener('click', () => { 
        if (search.isLiked) {
            ReactionUnlike(unlikesContainer, search.post_id); 
            search.isLiked = false; 
            likesButton.classList.remove('liked'); 
        } else {
            ReactionLike(likesContainer, search.post_id);
            search.isLiked = true; 
            likesButton.classList.add('liked'); 
            
        }
    });

    repliesButton.addEventListener('click', () => { 
        AddReplies(repliesContainer, search.post_id, search); 
    });

    repostButton.addEventListener('click', () => {
        if (search.isReposted) {
            actionUnrepost(search.post_id, repostButton); 
            search.isReposted = false;
        } else {
            actionRepost(search.post_id, repostButton); 
            search.isReposted = true;
        }
    });
    

}

function renderFollowSuggestion(suggestion){
    const contents = document.getElementById('search-contents') 
    contents.innerHTML = ''
    suggestion.forEach(user => {
        const followSuggestions = createFollowSuggestions(user)
        contents.appendChild(followSuggestions)
        addViewProfileListener()
    });
    attachFollowUnfollowListener();
}

function createFollowSuggestions(user){
    const followSuggestions = document.createElement('div');
    followSuggestions.setAttribute('class','follow-suggestions');

    const buttonText = user.isFollowing ? 'Unfollow' : 'Follow';
    const buttonClass = user.isFollowing ? 'unfollow-button' : 'follow-button'
    followSuggestions.innerHTML = `
        <ul class="suggestions-list">
            <li class="suggestion-item">
                <div class="profile-info">
                    <img src='${user.profile_image ? user.profile_image : '../icons/navSvg/user-svgrepo-com.svg'}' class="search-profile-icon" alt="profile-icon">
                    <div>
                        <h3 class="user-profile" data-userId="${user.user_id}">${user.username}</h3>
                        <p>${user.fullname}</p>
                        <p>${user.followers_count} followers</p>
                    </div>
                </div>
                <button class="${buttonClass}"  id="follow" data-userid="${user.user_id}">Follow</button>
            </li>
        </ul>`
    return followSuggestions;
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

function createViewProfileElement(data){
    const contents = document.getElementById('popUpProfile');
    const contentss = document.getElementById('search-contents');
    const foryouContents = document.getElementById('foryou');
    const searchBar = document.getElementById('search-bar');
    
    // Set the inner HTML of popUpProfile with a close button
    const buttonText = data.is_following === 1 ? 'Unfollow' : 'Follow Back'
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
    const contentsss = document.getElementById('profile-contents');
    fetchAccountPost(contentsss, data.id);

            // Threads Tab
    const threadsTab = document.getElementById('threads-tab');
    threadsTab.addEventListener('click', () => {
        fetchAccountPost(contentsss, data.id);
    });

    console.log(data)

            // Replies Tab
    const repliesTab = document.getElementById('replies-tab');
    repliesTab.addEventListener('click', () => {
        RepliesPost(contentsss, data.id);
    });

            // Reposts Tab
    const repostsTab = document.getElementById('reposts-tab');
    repostsTab.addEventListener('click', () => {
        RepostContents(contentsss, data.id);
    });

    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.tab-button.active').classList.remove('active');
            button.classList.add('active');
        });
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

function fetchFollowSuggestions() {
    axios.get('http://localhost:3000/v1/follow/', {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        if (response.data.success === true){
            const contents = document.getElementById('search-contents');
            const data = response.data.data.result
            renderFollowSuggestion(data)
        }
    })
}

function createPostButton() {
    const postButton = document.createElement('button');
    postButton.id = 'post-button';
    postButton.textContent = '+';
    return postButton;
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