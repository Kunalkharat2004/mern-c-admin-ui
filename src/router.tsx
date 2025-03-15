import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage/login";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";

const router = createBrowserRouter([
    {
        path:"/",
        element:<DashboardLayout />,
        children:[
            {
                path: "",
                element: <HomePage />
            },
        ]
    },

    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <LoginPage/>
            }
        ]
    },
])

export default router;