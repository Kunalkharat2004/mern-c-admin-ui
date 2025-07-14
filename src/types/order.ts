import { IAttributeConfigurationValue, ICategory } from ".";

export interface IProductPriceConfiguration {
  [key: string]: {
    priceType: "base" | "additional";
    availableOptions: {
      [key: string]: number;
    };
  };
}

export interface Product {
  _id: string;
  name: string;
  image: string;
  description: string;
  category: ICategory;
  isPublished: boolean;
  tenantId: string;
  categoryId: string;
  priceConfiguration: IProductPriceConfiguration;
  attributeConfiguration: Array<IAttributeConfigurationValue>;
}
export type Topping = {
  _id: string;
  name: string;
  price: number;
  image: string;
  tenantId: string;
  isPublished: boolean;
  createdAt: Date;
};

export interface CartItems
  extends Pick<Product, "_id" | "name" | "image" | "priceConfiguration"> {
  choosenConfiguration: {
    priceConfiguration: {
      [key: string]: string;
    };
    selectedToppings: Topping[];
  };
  qty: number;
  hash?: string;
}

export interface Address {
  label: "Home" | "Work" | "Other"; // e.g. “Home” or “Work”
  text: string; // full address line
  city: string; // city name
  postalCode: string; // ZIP / PIN
  phone: string; // phone number
  isDefault: boolean; // mark your primary address
}
export enum PaymentMode {
  CASH = "cod",
  CARD = "card",
}

export enum OrderStatus {
  RECEIVED = "received",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
}

export interface Customer {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  addresses: Address[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderType {
  _id?: string;
  cart: CartItems[];
  customerId: string;
  customer: Customer;
  total: number;
  discount: number;
  taxes: number;
  deliveryCharges: number;
  address: Address;
  tenantId: string;
  comment?: string;
  paymentMode: PaymentMode;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  receiptUrl?: string;
}
