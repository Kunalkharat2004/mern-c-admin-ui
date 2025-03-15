import { User } from "../store";

export const usePermission = () =>{
    const allowedRoles = ["admin", "manager"];

    const _hasPermission = (user: User | null)=>{
       if(user){
        return allowedRoles.includes(user.role);
       }
       return false 
    }
    return{
        isAllowed: (user:User | null)=> _hasPermission(user)
    }
}