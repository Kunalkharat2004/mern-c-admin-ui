import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuthStore } from "../store";

const AuthLayout = () => {
    const {user} = useAuthStore();
    const location = useLocation();
    if(user !== null){
      const redirect = new URLSearchParams(location.search).get("returnTo") ?? "/";
      return <Navigate to={redirect}/>
    }
  return (
    <>
        <Outlet/>
    </>
  )
}

export default AuthLayout;