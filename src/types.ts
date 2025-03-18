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
    tenant: Tenant
};

export interface Tenant {
    id: string;
    name: string;
    address: string;
}