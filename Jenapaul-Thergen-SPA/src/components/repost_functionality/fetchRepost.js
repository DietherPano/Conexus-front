import axios from 'axios';

export function fetchRepost(post_id) {
    return axios.get(`http://localhost:3000/v1/threads/repost/${user_id}`, {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        }
    })
    .then((response) => {
        console.log('Fetched repost data:', response.data);
        
        const reposts = response.data.reposts || [];  
        return reposts; 
    })
    .catch((error) => {
        console.error('Error fetching repost data:', error);
        return [];
    });
}
