import api from "./api";

interface CreateReviewRequest {
  orderId: number;
  rating: number;
  comment?: string;
}

interface CreateReviewResponse {
  message: string;
  reviewId: number;
  orderId: number;
  customerId: number;
  artisanId: number;
  rating: number;
  comment?: string;
  reviewDate: string;
}

export const createReview = async (
  request: CreateReviewRequest
): Promise<CreateReviewResponse> => {
  const response =
    await api.post<CreateReviewResponse>(
      "/Review",
      request
    );

  return response.data;
};