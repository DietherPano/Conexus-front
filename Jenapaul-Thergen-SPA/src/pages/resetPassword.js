import ResetPass from "../components/forgot-password/resetPassword";
import Layout from "../layouts/default";

export default function ResetPassword(){
    const { main } = Layout(this.root)

    ResetPass(main);
    
}