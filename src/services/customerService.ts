import api from "./api";

export interface CustomerProfileDto {
  address?: string;
  city?: string;
}

export interface Customer {
  customerId: number;
  userId: number;
  address?: string;
  city?: string;
  createdAt: string;
}

export const getCustomerProfile = async (): Promise<Customer> => {
  const response = await api.get<Customer>("/Customer/profile");
  return response.data;
};

export const createCustomerProfile = async (
  data: CustomerProfileDto
): Promise<Customer> => {
  const response = await api.post<Customer>(
    "/Customer/profile",
    data
  );
  return response.data;
};

export const updateCustomerProfile = async (
  data: CustomerProfileDto
): Promise<Customer> => {
  const response = await api.put<Customer>(
    "/Customer/profile",
    data
  );
  return response.data;
};