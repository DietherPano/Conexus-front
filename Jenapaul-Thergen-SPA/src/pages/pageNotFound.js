import '../styles/navBar.css';
import Layout from '../layouts/default';

export default function PageNotFound(){
    const { main } = Layout(this.root);

    main.innerHTML = `<h1> 404 Not Found </h1>`
}