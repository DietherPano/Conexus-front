import ForgotPass from "../components/forgot-password/forgotPassword";
import Layout from "../layouts/default";

export default function ForgotPassword(){
    const { main } = Layout(this.root)

    ForgotPass(main);
}