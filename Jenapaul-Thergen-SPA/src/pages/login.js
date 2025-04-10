import LogIn from "../components/login";
import Layout from "../layouts/default";

export default function SignIn(){
    const { main } = Layout(this.root)

    LogIn(main)
}