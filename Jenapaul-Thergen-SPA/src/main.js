import Welcome from "./pages/welcome";
import SPA from "./core/spa";
import PageNotFound from "./pages/pageNotFound";
import CreateAcc from "./pages/createAccount";
import SignIn from "./pages/login";
import ForgotPassword from "./pages/forgotPassword";
import './styles/common.css';
import MainPage from "./pages/mainPage";
import Profile from "./pages/profile"
import Activity from "./pages/activity";
import Search from "./pages/search";
import edit from "./pages/editprofile";
import ResetPassword from "./pages/resetPassword";
// import ReplyPage from "./pages/reply";

const app = new SPA({
    root: document.getElementById('app'),
    defaultRoute: PageNotFound,
})

app.add('/welcome', Welcome);

app.add('/identify', ForgotPassword)

app.add('/changing', ResetPassword)

app.add('/signup', CreateAcc)

app.add('/activity', Activity)

app.add('/search', Search)

app.add('/signin', SignIn)

app.add('/editProfile', edit)

app.add('/', MainPage)

// app.add('/post-reply', ReplyPage)

app.add('/profile', Profile)

app.handleRouteChanges();
