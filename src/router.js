import { createBrowserRouter } from "react-router-dom";
import Login from "./components/auth/login";
import App from "./App";
import ListVideo from "./components/listvideos";
import ViewVideo from "./components/viewvideo";
import Listplan from "./components/listplan";
import Viewplan from "./components/viewplan";
import Myplan from "./components/myplan";
import Register from "./components/auth/register";

const router = createBrowserRouter([
    { path: '', element: <App/> },
    { path : 'register', element: <Register/>},
    { path : 'login', element: <Login/>},
    {path: 'listvideos',element:<ListVideo/> },
    {path: 'viewvideo/:postId',element:<ViewVideo/> },
    {path: 'listplan',element:<Listplan/> },
    {path: 'viewplan/:postId',element:<Viewplan/> },
    {path: 'myplan',element:<Myplan/> },
]);

export default router;