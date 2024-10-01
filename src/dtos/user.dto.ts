import { User } from "@prisma/client";

export interface CreateUserDTO {
  name: string;
  email: string;
  username: string;
  password: string;
  avatar: string | null;
}

export interface ListAllUsersInputDTO {
  limit?: number;
  page?: number;
}

export interface ListallUsersOutputDTO {
  data: User[];
  pagination: {
    limit: number;
    page: number;
    count: number;
    totalPages: number;
  };
}

export interface updateUserInputDTO {
  id: string;
  name: string;
}
