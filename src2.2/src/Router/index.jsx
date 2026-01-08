import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App.jsx";
import Home from "../components/Home";
import Look from '../components/Look.jsx'
import Detail from "../components/Detail";

let router = createBrowserRouter([
    {
        path: '/',
        element: <App></App>,
        children: [
            {
                path: '/home',
                element: <Home></Home>
            }, {
                path: '/search',
                element: <Look></Look>
            }, {
                path: '/detail',
                element: <Detail></Detail>
            },
            {
                path: '/',
                element: <Navigate to='/home'></Navigate>
            }
        ],

    },
])

export default router