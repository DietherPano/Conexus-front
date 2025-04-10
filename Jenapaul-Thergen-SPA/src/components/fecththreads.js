import '../../styles/contents.css';
import axios from "axios"
export default function userThreads(root) {
    fetchthreads(root)
};

function fetchthreads(root){
    axios.get('http://localhost:3000/v1/account/post', {
        headers: {
            apikey: 'jenather',
            token: localStorage.getItem('token')
        }
    })
    .then((response) => {
        console.log(response)
        if (response.data.success === true){
            root.innerHTML = `
            <div class="userInfo">
                <h1>Username: ${response.data.data.username}</h1>
            `;
            
        }
    })
}
