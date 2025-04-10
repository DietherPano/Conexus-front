import axios from 'axios';

export default function actionRepost(post_id, button) {
    repost(post_id, button);
}

function repost(post_id, button) {
    axios.post(`http://localhost:3000/v1/threads/${post_id}/repost`, {}, {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        console.log('post id', post_id); 
        if (response.data.success) {
            const countElem = button.querySelector('.repost-count'); 
            if (countElem) {
                let currentCount = parseInt(countElem.textContent, 10) || 0;
                countElem.textContent = currentCount + 1; 
            }
            console.log('Response from server:', response);
        }
    })
    .catch((error) => {
        console.error('Error sending repost request:', error);
    });
}