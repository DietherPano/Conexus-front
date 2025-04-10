import Header from "../components/header";
import Navigation from "../components/nav";
import Layout from "../layouts/default";
import ActivityContents from "../components/activity/activity-contents";

export default function Activity() {
    const { header, navigation, main } = Layout(this.root);

    Header(header);
    Navigation(navigation);
    main.innerHTML = '';
    ActivityContents(main);
}
