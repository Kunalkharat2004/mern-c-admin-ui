import { Credentials, Restaurant, User } from "../types"
import api from "./client"

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL;
const CATALOG_SERVICE_URL = import.meta.env.VITE_CATALOG_SERVICE_URL;

// AUTH SERVICE
export const login = (credentials: Credentials)=> api.post(`${AUTH_SERVICE_URL}/auth/login`, credentials);

export const self = ()=> api.get(`${AUTH_SERVICE_URL}/auth/self`);

export const logout = () => api.post(`${AUTH_SERVICE_URL}/auth/logout`);

export const getAllUsers = (queryParamasString: string)=> api.get(`${AUTH_SERVICE_URL}/users?${queryParamasString}`);

export const getAllTenants = (queryParamsString: string)=> api.get(`${AUTH_SERVICE_URL}/tenant?${queryParamsString}`);

export const createUser = (userData: User)=> api.post(`${AUTH_SERVICE_URL}/users`, userData);

export const createRestaurant = (restaurantData: Restaurant)=> api.post(`${AUTH_SERVICE_URL}/tenant`, restaurantData);

export const updateUser = (userData: User,id:string)=> api.patch(`${AUTH_SERVICE_URL}/users/${id}`, userData);

export const deleteUser = (id:string)=> api.delete(`${AUTH_SERVICE_URL}/users/${id}`);

export const updateTenant = (restaurantData: Restaurant)=> api.patch(`${AUTH_SERVICE_URL}/tenant/${restaurantData.id}`, restaurantData);

export const deleteRestaurantApi = (id:string)=> api.delete(`${AUTH_SERVICE_URL}/tenant/${id}`);

export const getManagerCount = (id:string)=> api.get(`${AUTH_SERVICE_URL}/tenant/${id}/managers-count`);

// CATALOG SERVICE
export const getAllCategories = ()=> api.get(`${CATALOG_SERVICE_URL}/api/categories`);

export const getAllProducts = (queryParamsString: string)=> api.get(`${CATALOG_SERVICE_URL}/api/products?${queryParamsString}`);

export const createProductApi = (productData: FormData) => api.post(`${CATALOG_SERVICE_URL}/api/products`, productData,
    {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }
);

export const getSingleCategory = (categoryId: string) => api.get(`${CATALOG_SERVICE_URL}/api/categories/${categoryId}`);

export const updateProductApi = (productData: FormData, id: string) => api.put(`${CATALOG_SERVICE_URL}/api/products/${id}`, productData,
     {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }
);