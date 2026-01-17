import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Course from "../components/Course";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App></App>,
        children: [
            {
                path: '/course',
                element: <Course></Course>
            },
            {
                path: '/',
                element: <Navigate to='/course'></Navigate>
            }
        ]
    },
])

export default router