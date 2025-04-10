import axios from 'axios';

export default function actionUnrepost(post_id, button) {
    unrepost(post_id, button);
}

function unrepost(post_id, button) {
    axios.delete(`http://localhost:3000/v1/threads/${post_id}/unrepost`, {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        if (response.data.success) {
            const countElem = button.querySelector('.repost-count'); 
            if (countElem) {
                let currentCount = parseInt(countElem.textContent, 10) || 0;
                if (currentCount > 0) {
                    countElem.textContent = currentCount - 1; 
                }
            }
            console.log('Response from server:', response);
        }
    })
    .catch((error) => {
        console.error('Error sending unrepost request:', error);
    });
}