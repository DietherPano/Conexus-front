import '../../styles/activity-contents.css';
import Follow from './followFunction/follow';
import Unfollow from './followFunction/unfollow';
import Followers from './subComponents/Followers';
import Following from './subComponents/Following';
import addViewProfileListener from './subComponents/viewProfile';
import axios from 'axios';

export default function ActivityContents(root) {
    root.innerHTML = `
        <div id="activity-container">
            <div class="activity-nav" id="activity-btn">
                <button class="activity-tabs active" id="All">All</button>
                <button class="activity-tabs" id="Followers">Followers</button>
                <button class="activity-tabs" id="Following">Following</button>
            </div>
            <div class="activity-list" id="activity-list"></div>
            <div class="following-list" id="following-list"></div>
        </div>
        <div id="popUpProfile"></div>
    `;

    fetchFollowing()
    fetchFollowersNotFollowingBack()

    const tabButtons = document.querySelectorAll('.activity-tabs');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            document.querySelector('.activity-tabs.active').classList.remove('active');
            button.classList.add('active');
        });
    });
    const all = document.getElementById('All')
    all.addEventListener('click', ()=> {
        ActivityContents(root)
    })
}

function fetchFollowing(){
    const activity = document.getElementById('activity-list')
    const following = document.getElementById('following-list')
    axios.get('http://localhost:3000/v1/follow/following', {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        console.log(response)
        if (response.data.success === true){
            const data = response.data.data.result
            createFollowingList(data, following)

            const followingBtn = document.getElementById('Following')
            followingBtn.addEventListener('click', ()=> {
                Following(activity, following)
            })
        }
    })
}

function fetchFollowersNotFollowingBack(){
    const activity = document.getElementById('activity-list')
    const following = document.getElementById('following-list')
    axios.get('http://localhost:3000/v1/follow/follow', {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        console.log(response)
        if (response.data.success === true){
            const data = response.data.data.result
            createActivityItem(data,activity)
            const followers = document.getElementById('Followers')
            followers.addEventListener('click', () => {
                Followers(activity,following);
            })
        }
    })
}

function createFollowingList(data, following){
    data.forEach(user => {
        const followContainer = document.createElement('div')
        followContainer.setAttribute('class', 'activity-item')
        const buttonText = user.is_followed_back === 1 ? 'Unfollow' : 'Unfollow'
        const buttonClass = user.is_followed_back === 1 ? 'unfollow-button' : 'unfollow-button';
        const action = user.is_following_back === 1 ? 'Followed' : 'Following';
        followContainer.innerHTML = `
                <div class="profile-info">
                    <img src='${user.profile_image ? user.profile_image : '../icons/navSvg/user-svgrepo-com.svg'}' class="activity-profile-icon" alt="profile-icon">
                    <div>
                        <h1 class="user-profile1" style="font-size: 20px;" data-userId="${user.user_id}">${user.username}</h1>
                        <p class="action">${action}</p>
                    </div>
                </div>
                <button class="${buttonClass}" data-userid="${user.user_id}">${buttonText}</button>
        `;
        following.appendChild(followContainer)
        addViewProfileListener()
    });
    attachFollowUnfollowListener()
}

function createActivityItem(data, activity) {
    data.forEach(user => {
        const activityContainer = document.createElement('div')
        activityContainer.setAttribute('class', 'activity-item')
        const buttonText = user.is_following === 1 ? 'Unfollow' : 'Follow Back'
        const buttonClass = user.is_following === 1 ? 'unfollow-button' : 'follow-button';
        const action = user.is_following === 0 ? 'Followed you' : '';
        activityContainer.innerHTML = `
                <div class="profile-info">
                    <img src='${user.profile_image ? user.profile_image : '../icons/navSvg/user-svgrepo-com.svg'}' class="activity-profile-icon" alt="profile-icon">
                    <div>
                        <h1 class="user-profile1" data-userId="${user.user_id}">${user.username}</h1>
                        <p class="action">${action}</p>
                    </div>
                </div>
                <button class="${buttonClass}" data-userid="${user.user_id}">${buttonText}</button>
        `;
        activity.appendChild(activityContainer)
        addViewProfileListener()
    });
    
    attachFollowUnfollowListener()
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
