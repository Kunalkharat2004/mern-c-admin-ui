export type Credentials = {
    email: string;
    password: string;
}

export interface User {
    id?: string;
    email: string;
    address: string;
    firstName: string;
    lastName: string;
    role: string;
    tenant: Tenant | null;
};

export interface Tenant {
    _id?: string;
    id: string;
    name: string;
    address: string;
}

export interface Restaurant {
    id?: string;
    name: string;
    address: string;
}

export interface FieldData {
    name: string[];
    value?: string;
}

export interface ICategory {
    _id: string;
    name: string;
}

export interface Products {
    name: string;
    image: string;
    description: string;
    category: ICategory;
    isPublished: boolean;
}