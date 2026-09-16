import api from "./api";
import type { ServiceRequestDto } from "../types/api";

export const createServiceRequest = async (
  data: ServiceRequestDto,
  subjectImages: File[]
) => {
  const formData = new FormData();

  formData.append(
    "ArtisanId",
    String(data.artisanId)
  );

  formData.append(
    "CategoryId",
    String(data.categoryId)
  );

  if (data.description) {
    formData.append(
      "Description",
      data.description
    );
  }

  formData.append(
    "Size",
    data.size
  );

  formData.append(
    "NoOfFaces",
    String(data.noOfFaces)
  );

  // Multiple Subject Images
  subjectImages.forEach((image) => {
    formData.append(
      "SubjectImages",
      image
    );
  });

  formData.append(
    "Location",
    data.location
  );

  formData.append(
    "Budget",
    String(data.budget)
  );

  formData.append(
    "Deadline",
    data.deadline
  );

  if (data.instructions) {
    formData.append(
      "Instructions",
      data.instructions
    );
  }

  const response = await api.post(
    "/ServiceRequest",
    formData
  );

  return response.data;
};

export const getCustomerRequests = async () => {
  const response = await api.get(
    "/ServiceRequest"
  );

  return response.data;
};

export const getServiceRequestDetails = async (
  requestId: number
) => {
  const response = await api.get(
    `/ServiceRequest/${requestId}`
  );

  return response.data;
};

export const cancelServiceRequest = async (
  requestId: number
) => {
  const response = await api.put(
    `/ServiceRequest/${requestId}/cancel`
  );

  return response.data;
};