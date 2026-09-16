export interface User {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface UserRegisterDto {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface ServiceRequestDto {
  artisanId: number;
  categoryId: number;
  description?: string;
  size: string;
  noOfFaces: number;
  subjectImages?: string;
  location: string;
  budget: number;
  deadline: string;
  instructions?: string;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  description?: string;
}