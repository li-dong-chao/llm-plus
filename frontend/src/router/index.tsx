import { createBrowserRouter } from "react-router-dom";

import Layout from "@/pages/Layout";
import Login from "@/pages/Login";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout></Layout>
    },
    {
        path: '/login',
        element: <Login></Login>
    }
])


export default router;
