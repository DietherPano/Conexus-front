import axios from 'axios'; 
// import '../../styles/coneXus.css'; 
// import '../../styles/createreply.css'; 


export default async function ReactionUnlike(unlikesContainer, post_id) {
    if (!post_id) {
        console.error('Post ID is invalid.');
        return;
    }

    if (!unlikesContainer) {
        console.error('Unlike container not found');
        return;
    }


    await unlike(unlikesContainer, post_id);
}

async function unlike(unlikesContainer, post_id) {
    try {
        const response = await axios.delete(
            `http://localhost:3000/v1/threads/${post_id}/unlike`, 
            {
                headers: {
                    apikey: 'jenather',
                    token: localStorage.getItem('token'),
                },
            }
        );

        console.log('Response from server:', response); 

        if (response.data.success) {
            const updatedLikes = await fetchUpdatedLikes(post_id);

            unlikesContainer.innerHTML = `<img id="icon" src="../icons/navSvg/heart-svgrepo-com.svg" alt=""> ${updatedLikes}`;
        } else {
            console.error('Server responded with an unsuccessful status:', response.data);
        }
            
    } catch (error) {
        console.error('Error during unlike or fetch operation:', error);
        displayError('Failed to process your request.');
    }
}

async function fetchUpdatedLikes(post_id) {
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
        return 0; // Return 0 or handle appropriately
    }
}

function displayError(message) {
    const errorMessage = document.querySelector('#errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'block';
        errorMessage.textContent = message;
    }
}
