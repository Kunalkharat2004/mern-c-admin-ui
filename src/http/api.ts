import { Credentials, Promo, Restaurant, User } from "../types";
import api from "./client";

const AUTH_SERVICE_URL = import.meta.env.VITE_AUTH_SERVICE_URL;
const CATALOG_SERVICE_URL = import.meta.env.VITE_CATALOG_SERVICE_URL;
const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL;

// AUTH SERVICE
export const login = (credentials: Credentials) =>
  api.post(`${AUTH_SERVICE_URL}/auth/login`, credentials);

export const self = () => api.get(`${AUTH_SERVICE_URL}/auth/self`);

export const logout = () => api.post(`${AUTH_SERVICE_URL}/auth/logout`);

export const getAllUsers = (queryParamasString: string) =>
  api.get(`${AUTH_SERVICE_URL}/users?${queryParamasString}`);

export const getAllTenants = (queryParamsString: string) =>
  api.get(`${AUTH_SERVICE_URL}/tenant?${queryParamsString}`);

export const getTenantById = (id: string) =>
  api.get(`${AUTH_SERVICE_URL}/tenant/${id}`);

export const createUser = (userData: User) =>
  api.post(`${AUTH_SERVICE_URL}/users`, userData);

export const createRestaurant = (restaurantData: Restaurant) =>
  api.post(`${AUTH_SERVICE_URL}/tenant`, restaurantData);

export const updateUser = (userData: User, id: string) =>
  api.patch(`${AUTH_SERVICE_URL}/users/${id}`, userData);

export const deleteUser = (id: string) =>
  api.delete(`${AUTH_SERVICE_URL}/users/${id}`);

export const updateTenant = (restaurantData: Restaurant) =>
  api.patch(`${AUTH_SERVICE_URL}/tenant/${restaurantData.id}`, restaurantData);

export const deleteRestaurantApi = (id: string) =>
  api.delete(`${AUTH_SERVICE_URL}/tenant/${id}`);

export const getManagerCount = (id: string) =>
  api.get(`${AUTH_SERVICE_URL}/tenant/${id}/managers-count`);

// CATALOG SERVICE
export const getAllCategories = () =>
  api.get(`${CATALOG_SERVICE_URL}/api/categories`);

export const getAllProducts = (queryParamsString: string) =>
  api.get(`${CATALOG_SERVICE_URL}/api/products?${queryParamsString}`);

export const createProductApi = (productData: FormData) =>
  api.post(`${CATALOG_SERVICE_URL}/api/products`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getSingleCategory = (categoryId: string) =>
  api.get(`${CATALOG_SERVICE_URL}/api/categories/${categoryId}`);

export const updateProductApi = (productData: FormData, id: string) =>
  api.put(`${CATALOG_SERVICE_URL}/api/products/${id}`, productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// ORDER SERVICE
export const getAllPromos = (queryParamasString: string) =>
  api.get(`${ORDER_SERVICE_URL}/api/coupon?${queryParamasString}`);

export const deleteProduct = (id: string) =>
  api.delete(`${CATALOG_SERVICE_URL}/api/products/${id}`);

export const deletePromo = (id: string) =>
  api.delete(`${ORDER_SERVICE_URL}/api/coupon/${id}`);

export const createPromo = (promoData: Promo) =>
  api.post(`${ORDER_SERVICE_URL}/api/coupon`, promoData);

export const updatePromo = (promoData: Promo, id: string) =>
  api.patch(`${ORDER_SERVICE_URL}/api/coupon/${id}`, promoData);

export const  getOrders = (queryParams:string)=>
  api.get(`${ORDER_SERVICE_URL}/api/order?${queryParams}`)

