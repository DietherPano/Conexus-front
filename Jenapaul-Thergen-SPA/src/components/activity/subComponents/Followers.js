import axios from 'axios';
import Follow from '../followFunction/follow';
import Unfollow from '../followFunction/unfollow';
import addViewProfileListener from './viewProfile';

export default function Followers(activity, following){
    activity.innerHTML= ''
    following.innerHTML= ''
    axios.get('http://localhost:3000/v1/follow/followers', {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token')
        }
    })
    .then((response) => {
        if (response.data.success === true){
            const data = response.data.data.result
            createActivityElement(data, activity)
            attachFollowUnfollowListener()
        }
    })  
}

function createActivityElement(data, activity){
    data.forEach(user => {
        const activityContainer = document.createElement('div')
        activityContainer.setAttribute('class', 'activity-item')
        const buttonText = user.is_following === 1 ? 'Unfollow' : 'Follow'
        const buttonClass = user.is_following === 1 ? 'unfollow-button' : 'follow-button';
        const action = user.is_following === 0 ? 'Followed you' : 'Following';
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