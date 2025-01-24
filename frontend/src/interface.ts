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
