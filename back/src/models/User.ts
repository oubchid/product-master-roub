export interface User {
  id: number;
  username: string;
  firstname: string;
  email: string;
  password: string;
  createdAt: number;
  updatedAt: number;
}

export type CreateUserDTO = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUserDTO = Partial<
  Omit<User, 'id' | 'password' | 'createdAt' | 'updatedAt'>
>;

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
  firstname: string;
  email: string;
  createdAt: number;
  updatedAt: number;
}
