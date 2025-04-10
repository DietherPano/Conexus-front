import '../styles/createPost.css';


export default function CreatePost(root){
    root.innerHTML = `     
    <main class="userPost-container">
      <div class="userInfo">
        <img src="profile-picture.jpg" alt="Profile Picture" class="profile-picture">
        <p>Username</p>
        <div class="contents-container">
          <form enctype="multipart/form-data" id="createpost">
            <input type="text" name="content" placeholder="What's on your mind?" required>
            <span id="contentError" style="display: none; color: red;"></span>
            <span id="errorMessage" style="display: none; color: red;"></span>
            <button class="post-button" type="submit">Post</button>
          </form>
        </div>
      </div>
      <div class="post-feed" id="contents"></div>
      <div class="message-popup-overlay" id="popupOverlay" style="display: none;">
        <div class="popup" id="popup">
          <span class="close" id="closePopup">&times;</span>
          <div class="popup-content">
            <p>Thanks for creating a post!</p>
            <h3>Welcome to ConeXus</h3>
            <button id="continueBtn">Continue</button>
          </div>
        </div>
      </div>
    </main>
    `;
}
    