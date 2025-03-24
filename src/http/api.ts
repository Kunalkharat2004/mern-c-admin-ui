import { Credentials, Restaurant, User } from "../types"
import api from "./client"

export const login = (credentials: Credentials)=> api.post("/auth/login", credentials);
export const self = ()=> api.get("/auth/self");
export const logout = () => api.post("/auth/logout");
export const getAllUsers = (queryParamasString: string)=> api.get(`/users?${queryParamasString}`);
export const getAllTenants = ()=> api.get("/tenant");
export const createUser = (userData: User)=> api.post("/users", userData);
export const createRestaurant = (restaurantData: Restaurant)=> api.post("/tenant", restaurantData);