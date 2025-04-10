import WelcomePage from "../components/welcome";
import Layout from "../layouts/default";

export default function Welcome(){
    const { navigation, main } = Layout(this.root);
    
    WelcomePage(main);
}
