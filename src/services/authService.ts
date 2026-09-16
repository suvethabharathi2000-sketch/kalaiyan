import api from "./api";
import type {
  UserRegisterDto,
  UserLoginDto,
  LoginResponse,
} from "../types/api";

export const registerUser = async (
  data: UserRegisterDto
) => {
  const response = await api.post("/User/register", data);
  return response.data;
};

export const loginUser = async (
  data: UserLoginDto
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/User/login",
    data
  );

  return response.data;
};