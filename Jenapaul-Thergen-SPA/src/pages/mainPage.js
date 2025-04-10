import '../styles/navBar.css';
import Layout from '../layouts/default';
import Navigation from '../components/nav';
import Header from '../components/header';
import Contents from '../components/home/home-contents';

export default function MainPage() {
    const { header, navigation, main } = Layout(this.root);
    Header(header);
    Navigation(navigation);
    Contents(main)
}