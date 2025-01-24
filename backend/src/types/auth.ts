export interface IUser {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt?: Date;
}
