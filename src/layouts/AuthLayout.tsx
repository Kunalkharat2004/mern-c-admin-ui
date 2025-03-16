import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store";

const AuthLayout = () => {
    const {user} = useAuthStore();
    if(user !== null){
      return <Navigate to="/"/>
    }
  return (
    <>
        <h1>AuthLayout</h1>
        <Outlet/>
    </>
  )
}

export default AuthLayout