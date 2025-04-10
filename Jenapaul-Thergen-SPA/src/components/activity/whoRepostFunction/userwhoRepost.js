import axios from 'axios';

export default function UserRepost(activity, whorepost, user_Id) {
    // Ensure arguments are valid
    if (!activity || !whorepost) {
        console.error('Activity or user_repost element is invalid.');
        return;
    }
    if (!userId) {
        console.error('Invalid userId provided.');
        return;
    }

    // Clear previous content
    activity.innerHTML = '';
    whorepost.innerHTML = '';

    // Fetch repost data from API
    axios.get(`http://localhost:3000/v1/threads/who-repost/${user_Id}`, {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token'),
        },
    })
    .then((response) => {
        // Log response for debugging
        console.log('API Response:', response.data);

        if (response.data.success === true) {
            const data = response.data.data.result;

            // Ensure data is valid and not empty
            if (Array.isArray(data) && data.length > 0) {
                createuserwhorepostListElement(data, whorepost);
            } else {
                whorepost.innerHTML = '<p>No repost data available.</p>';
            }
        } else {
            console.error('API did not return success:', response.data.message || 'Unknown error.');
            whorepost.innerHTML = '<p>Error fetching repost data.</p>';
        }
    })
    .catch((error) => {
        console.error('Error fetching repost data:', error.response?.data || error);
        whorepost.innerHTML = '<p>Failed to load repost data. Please try again later.</p>';
    });
}

function createuserwhorepostListElement(data, whorepost) {
    data.forEach((user) => {
        const userwhorepostContainer = document.createElement('div');
        userwhorepostContainer.setAttribute('class', 'activity-item');

        const action = 'reposted';

        userwhorepostContainer.innerHTML = `
            <div class="profile-info">
                <img 
                    src="${user.profile_image ? user.profile_image : '../icons/navSvg/user-svgrepo-com.svg'}" 
                    class="activity-profile-icon" 
                    alt="profile-icon">
                <div>
                    <span class="username">${user.username}</span>
                    <span class="action">${action}</span>
                </div>
            </div>
        `;

        whorepost.appendChild(userwhorepostContainer);
    });

    console.log('Final rendered content:', whorepost.innerHTML);
}
