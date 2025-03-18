import { Credentials, User } from "../types"
import api from "./client"

export const login = (credentials: Credentials)=> api.post("/auth/login", credentials);
export const self = ()=> api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
export const getAllUsers = ()=> api.get("/users");
export const getAllTenants = ()=> api.get("/tenant");
export const createUser = (userData: User)=> api.post("/users", userData);