import { useQuery } from "@tanstack/react-query"
import { Outlet } from "react-router-dom"
import { self } from "../http/api";
import { useEffect } from "react";
import { useAuthStore } from "../store";
import Loader from "../components/icons/Loader";
import { AxiosError } from "axios";

const getSelf = async()=>{
    const {data} = await self();
    return data;
}

const Root = () => {
    const {setUser} = useAuthStore();

    const {data,isPending} = useQuery({
        queryKey: ["self"],
        queryFn: getSelf,
        retry:(failureCount, error)=>{
            if(error instanceof AxiosError && error.response?.status === 401){
                return false;
            }
            return failureCount < 3;
        }
    })

    useEffect(()=>{
        if(data){
            setUser(data);
        }
    },[data,setUser])

    if(isPending){
        return <>
        <Loader/>
        </>
    }
  return (
    <>
        <Outlet/>
    </>
  )
}

export default Root