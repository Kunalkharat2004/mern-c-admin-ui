import { useQuery } from "@tanstack/react-query"
import { Outlet } from "react-router-dom"
import { self } from "../http/api";
import { useEffect } from "react";
import { useAuthStore } from "../store";
import Loader from "../components/icons/Loader";

const getSelf = async()=>{
    const {data} = await self();
    return data;
}

const Root = () => {
    const {setUser} = useAuthStore();

    const {data,isPending} = useQuery({
        queryKey: ["self"],
        queryFn: getSelf,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })

    useEffect(()=>{
        console.log(data);        
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