import '../styles/navBar.css';
import Layout from '../layouts/default';
import Navigation from '../components/nav';
import Header from '../components/header';
import ProfileContents from '../components/profile/profile-contents';

export default function ProfilePage() {
    const { header, navigation, main } = Layout(this.root);
    
    Header(header);
    Navigation(navigation);
    ProfileContents(main);
}
