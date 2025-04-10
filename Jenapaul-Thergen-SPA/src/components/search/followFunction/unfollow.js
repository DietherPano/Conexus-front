import axios from 'axios';

export default function Unfollow(userId, button){
    axios.delete(`http://localhost:3000/v1/follow/unfollow/${userId}`,{
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        console.log(response)
        if (response.data.success === true){
            button.textContent = 'Follow';
            button.classList.remove('unfollow-button');
            button.classList.add('follow-button')
            
            const followersCountElement = button.closest('.suggestion-item').querySelector('p:last-child');
            if (followersCountElement) {
                let count = parseInt(followersCountElement.textContent) || 0;
                if(count > 0){
                    followersCountElement.textContent = `${--count} followers`
                }
            }
        }
    })
}