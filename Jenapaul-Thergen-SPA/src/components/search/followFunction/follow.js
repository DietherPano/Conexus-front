import axios from "axios";

export default function Follow(userId,button){
    const payload = {}
    axios.post(`http://localhost:3000/v1/follow/${userId}`, payload, {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        console.log(response)
        if(response.data.success === true){
            button.textContent = 'Unfollow';
            button.classList.remove('follow-button')
            button.classList.add('unfollow-button');

            const followersCountElement = button.closest('.suggestion-item').querySelector('p:last-child');
            if (followersCountElement) {
                let count = parseInt(followersCountElement.textContent) || 0;
                followersCountElement.textContent = `${++count} followers`
            }
        }
    })
}