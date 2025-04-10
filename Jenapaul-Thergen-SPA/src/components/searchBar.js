import '../styles/search-contents.css';

export default function loadSearchBar(root) {
    const searchBarContainer = document.createElement('div');
    searchBarContainer.classList.add('search-bar-container');

    searchBarContainer.innerHTML = `
        <div class="search-bar">
            <input type="text" class="search-input" placeholder="Search" aria-label="Search">
            <button class="search-icon">
                <img src="../icons/navSvg/search-svgrepo-com.svg" alt="Search Icon">
            </button>
        </div>
        <div class="follow-suggestions">
            <h2>Follow suggestions</h2>
            <ul class="suggestions-list">
                <li class="suggestion-item">
                    <div class="profile-info">
                        <div class="profile-icon"></div>
                        <div>
                            <h3>Genniesys_B</h3>
                            <p>Genniesys Bracia</p>
                            <p>1M Followers</p>
                        </div>
                    </div>
                    <button class="follow-button">Follow</button>
                </li>
                <li class="suggestion-item">
                    <div class="profile-info">
                        <div class="profile-icon"></div>
                        <div>
                            <h3>Nathi-Kun</h3>
                            <p>Nathaniel Faburada</p>
                            <p>4M Followers</p>
                        </div>
                    </div>
                    <button class="follow-button">Follow</button>
                </li>
                <!-- Repeat for other suggestions -->
            </ul>
        </div>
    `;

    root.appendChild(searchBarContainer);
}