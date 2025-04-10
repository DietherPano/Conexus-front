// Import the search bar
import { loadSearchBar } from '../components/searchBar.js';

export function loadMainLayout() {
    const app = document.getElementById('app') || document.body;

    const layoutContainer = document.createElement('div');
    layoutContainer.id = 'main-layout';

    // Contents Div with Search Bar
    const contentsDiv = document.createElement('div');
    contentsDiv.id = 'contents';

    const searchBar = loadSearchBar();
    contentsDiv.appendChild(searchBar); // Add the search bar to contents

    layoutContainer.appendChild(contentsDiv);
    app.appendChild(layoutContainer);
}
