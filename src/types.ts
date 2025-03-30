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
    id: string;
    name: string;
    address: string;
}

export interface Restaurant {
    name: string;
    address: string;
}

export interface FieldData {
    name: string[];
    value?: string;
}