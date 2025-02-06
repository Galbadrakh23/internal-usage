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
export interface DailyReportListProps {
  dailyReports: DailyReport[];
}
export interface HourlyReportListProps {
  hourlyReports: HourlyReport[];
}

export interface Employee {
  id: string | number;
  name: string;
  position: string;
  email: string;
  company: {
    name: string;
    // ... other company properties
  };
  phone: string;
}
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export enum ReportStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
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
}

export interface DailyReport {
  id: number;
  title: string;
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
export interface HourlyReport {
  id: number;
  userId: string;
  activity: string;
  title: string;
  date: Date;
  user: User;
}
