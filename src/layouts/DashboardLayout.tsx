import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "../store"

const DashboardLayout = () => {
  const {user} = useAuthStore();
  if(user === null){
   return <Navigate to="/auth/login"/>
  }
  return (
    <>
    <h1>Dashboard Layout</h1>
    <Outlet/>
    </>
  )
} 

export default DashboardLayout;