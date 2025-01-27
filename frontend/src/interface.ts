export interface IUser {
  username: string;
  email: string;
  password: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IRegister extends IUser {
  confirmPassword: string;
}
export interface UserContextType {
  user: IUser | null;
  setToken: (token: string) => void;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  fetchUserData?: () => void;
}

export interface Employee {
  id: number;
  name: string | null;
  position: string | null;
  department: string | null;
  email: string | null;
  phone: string | null;
}
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export enum ReportStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  reportId: number;
}

export interface File {
  id: number;
  url: string;
  fileType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyReport {
  id: number;
  content: string;
  status: ReportStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  date: Date;
  comments: Comment[];
  user: User;
  files: File[];
}
