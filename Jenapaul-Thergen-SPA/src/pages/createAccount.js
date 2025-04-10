import CreateAccount from "../components/signUp";
import Layout from "../layouts/default";

export default function CreateAcc(){
    const { main } = Layout(this.root)

    CreateAccount(main);
}