import '../styles/contents.css';
import Header from "../components/header";
import Navigation from "../components/nav";
import Layout from "../layouts/default";
import loadSearchBar from "../components/searchBar";
import SearchContents from "../components/search/search-contents"

export default function Search() {
    const { header, navigation, main } = Layout(this.root);

    Header(header);
    Navigation(navigation);
    SearchContents(main);
}