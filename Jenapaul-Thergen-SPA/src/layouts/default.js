export default function Layout(root){
    root.innerHTML = `
    <header id="header"></header>
    <div id="container">
      <navigation id="navigation"></navigation>
      <main id="main"></main>
    </div>
    `
    
    return{
        header: document.getElementById('header'),
        navigation: document.getElementById('navigation'),
        main: document.getElementById('main'),
    }
}