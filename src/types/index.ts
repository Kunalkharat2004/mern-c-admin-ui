export type Credentials = {
    email: string;
    password: string;
}

export interface User {
    id?: string;
    email: string;
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

export interface IPriceConfiguration {
    [key: string]:{
       priceType: "base" | "additional",
       availableOptions: Array<string> | Map<string,number>;
    }
   }
export interface IAttributeConfiguration {
       name: string,
       widgetType: "radio" | "switch",
       defaultValue: string,
       availableOptions: Array<string>
}

export interface IAttributeConfigurationValue { 
    name: string;
    value: string;
}
   
export interface ICategory {
        _id: string;
       name: string,
       priceConfiguration: IPriceConfiguration,
       attributeConfiguration: Array<IAttributeConfiguration>
   }

export interface Products {
    _id: string;
    name: string;
    image: string;
    description: string;
    category: ICategory;
    isPublished: boolean;
    tenantId: string;
    categoryId: string;
    priceConfiguration: IPriceConfiguration;
    attributeConfiguration: Array<IAttributeConfigurationValue>;
}

export interface CreateProduct extends Omit<Products, 'image'> { 
    image: {file: File};
}

export interface CreateProductResponse {
    msg: string;
    _id: string;
}

export interface Promo {
    _id?: string;
  title: string;
  code: string;
  discount: number; // in percentage
  validTill: Date;
  tenantId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
