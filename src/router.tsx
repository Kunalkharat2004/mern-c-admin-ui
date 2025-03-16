import { createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage/login";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
import Root from "./layouts/Root";

const router = createBrowserRouter([
    {
        path:"/",
        element:<Root/>,
        children:[
            {
                path:"",
                element:<DashboardLayout />,
                children:[
                    {
                        path: "",
                        element: <HomePage />
                    },
                ]
            },
        
            {
                path: "auth",
                element: <AuthLayout />,
                children: [
                    {
                        path: "login",
                        element: <LoginPage/>
                    }
                ]
            },
        ]
    }
    
])

export default router;