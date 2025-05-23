import axios from 'axios';



export default async function replyReactionLike(likesContainer, post_id) {
    if (!post_id) {
        console.error('reply_id ID is invalid.');
        return;
    }

    if (!likesContainer) {
        console.error('Likes container not found');
        return;
    }

    await like(likesContainer, post_id);
}

async function like(likesContainer, post_id) {
    const payload = {};

    try {
        // Send like request to the server
        const response = await axios.post(
            `http://localhost:3000/v1/threads/${post_id}/like`, 
            payload, 
            {
                headers: {
                    apikey: 'jenather',
                    token: localStorage.getItem('token'),
                },
            }
        );

        console.log('Response from server:', response);

        if (response.data.success) {
          
            const updatedLikes = await fetchUpdatedreplyLikes(post_id);

            likesContainer.innerHTML = `<img id="icon" src="../icons/navSvg/heart-svgrepo-com.svg" alt=""> ${updatedLikes}`;
        } else {
            console.error('Server responded with an unsuccessful status:', response.data);
        }
    } catch (error) {
        console.error('Error during like or fetch operation:', error);
        displayError('Failed to process your request.');
    }
}

async function fetchUpdatedreplyLikes(post_id) {
    try {
        console.log(`Fetching likes count for post ID: ${post_id}`);
        const response = await axios.get(
            `http://localhost:3000/v1/threads/${post_id}/count-likes`,
            {
                headers: {
                    apikey: 'jenather',
                    token: localStorage.getItem('token'),
                },
            }
        );
        console.log("Likes count response:", response.data);
        return response.data.likesCount;
    } catch (error) {
        console.error("Error fetching updated likes count:", error.response?.data || error.message);
        return 0; 
    }
}


function displayError(message) {
    const errorMessage = document.querySelector('#errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = message;
    }
}
