import api from "./api";

export interface ArtisanProfileDto {
  companyName?: string;
  experienceYears?: number;
  serviceArea?: string;
  description?: string;
  previousWorkImages?: string;
}

export interface ArtisanProfile {
  artisanId: number;
  userId: number;
  companyName?: string;
  experienceYears?: number;
  serviceArea?: string;
  description?: string;
  previousWorkImages?: string;
  isApproved: boolean;
  createdAt: string;
}

export const getArtisanRequests = async () => {
  const response = await api.get("/Artisan/requests");
  return response.data;
};

export const getArtisanProfile = async (): Promise<ArtisanProfile> => {
  const response = await api.get<ArtisanProfile>("/Artisan/profile");
  return response.data;
};

export const createArtisanProfile = async (
  data: ArtisanProfileDto
): Promise<ArtisanProfile> => {
  const response = await api.post<ArtisanProfile>(
    "/Artisan/profile",
    data
  );

  return response.data;
};

export const updateArtisanProfile = async (
  data: ArtisanProfileDto
): Promise<ArtisanProfile> => {
  const response = await api.put<ArtisanProfile>(
    "/Artisan/profile",
    data
  );

  return response.data;
};

export const getArtisanOrders = async () => {
  const response = await api.get("/Order/artisan");
  return response.data;
};

export const acceptArtisanRequest = async (
  requestId: number
) => {
  const response = await api.post(
    `/Artisan/requests/${requestId}/accept`
  );

  return response.data;
};

export const rejectArtisanRequest = async (
  requestId: number
) => {
  const response = await api.post(
    `/Artisan/requests/${requestId}/reject`
  );

  return response.data;
};