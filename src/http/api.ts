import { Credentials, Restaurant, User } from "../types"
import api from "./client"

export const login = (credentials: Credentials)=> api.post("/auth/login", credentials);
export const self = ()=> api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
export const getAllUsers = (queryParamasString: string)=> api.get(`/users?${queryParamasString}`);
export const getAllTenants = (queryParamsString: string)=> api.get(`/tenant?${queryParamsString}`);
export const createUser = (userData: User)=> api.post("/users", userData);
export const createRestaurant = (restaurantData: Restaurant)=> api.post("/tenant", restaurantData);
export const updateUser = (userData: User,id:string)=> api.patch(`/users/${id}`, userData);
