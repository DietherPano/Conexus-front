import axios from 'axios';

export default async function DeletePost(deleteContainer, post_id) {
    await deletePost(deleteContainer, post_id);
}

async function deletePost(deleteContainer, post_id) {
    try {
        const response = await axios.delete(
            `http://localhost:3000/v1/threads/${post_id}/`,
            {
                headers: {
                    apikey: 'jenather',
                    token: localStorage.getItem('token'),
                },
            }
        );

        console.log('Response from server:', response);

        if (response.data.success) {
            console.log('Post deleted successfully!');
            
            // Remove the post element from the DOM
            if (deleteContainer) {
                deleteContainer.remove();
                console.log('Post container removed from the DOM.');
            }
        } else {
            console.error('Failed to delete the post:', response.data.message);
        }
    } catch (error) {
        console.error('Error occurred while deleting the post:', error.message);
    }
}
