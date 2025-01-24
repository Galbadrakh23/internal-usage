// types/user.ts
export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  EMPLOYEE = "EMPLOYEE",
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phoneNumber: number;
  createdAt: Date;
  updatedAt: Date;
};
