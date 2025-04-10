import axios from 'axios';
import Follow from '../followFunction/follow';
import Unfollow from '../followFunction/unfollow';
import addViewProfileListener from './viewProfile';

export default function Following(activity, following){
    activity.innerHTML = '';
    following.innerHTML = '';
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
            createFollowingListElement(data,following)
            attachFollowUnfollowListener()
        }
    })
}

function createFollowingListElement(data, following){
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
                        <h1 class="user-profile1" data-userId="${user.user_id}">${user.username}</h1>
                        <p class="action">${action}</p>
                    </div>
                </div>
                <button class="${buttonClass}" data-userid="${user.user_id}">${buttonText}</button>
        `;
        following.appendChild(followContainer)
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