import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store";

const AuthLayout = () => {
    const {user} = useAuthStore();
    if(user !== null){
      return <Navigate to="/"/>
    }
  return (
    <>
        <Outlet/>
    </>
  )
}

export default AuthLayout