import userInfo from "../components/editProfile";
import Layout from "../layouts/default";

export default function edit(){
    const { main } = Layout(this.root)
    userInfo(main)
}