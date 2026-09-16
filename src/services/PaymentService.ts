import api from "./api";

export interface PaymentDto {
  orderId: number;
  paymentType: string;
  paymentMethod: string;
}

export interface PaymentResponse {
  message: string;
  paymentId: number;
  orderId: number;
  paymentType: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  transactionReference?: string;
  paymentDate: string;
}

export const createPayment = async (
  data: PaymentDto
): Promise<PaymentResponse> => {
  const response = await api.post<PaymentResponse>(
    "/Payment",
    data
  );

  return response.data;
};