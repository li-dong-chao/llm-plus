import { createBrowserRouter } from "react-router-dom";

import Layout from "@/pages/Layout";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AuthRoute from "@/components/AuthRoute";



const router = createBrowserRouter([
    {
        path: '/',
        element: <AuthRoute><Layout></Layout></AuthRoute>
    },
    {
        path: '/c/',
        element: <AuthRoute><Layout></Layout></AuthRoute>,
        children: [
            {
                path: ':id',
                element: <AuthRoute><Layout></Layout></AuthRoute>,
            }
        ]
    },
    {
        path: '/login',
        element: <Login></Login>
    },
    {
        path: '/register',
        element: <Register></Register>
    }
])


export default router;
