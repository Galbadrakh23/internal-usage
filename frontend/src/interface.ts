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
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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
  ИЛГЭЭМЖ = "ИЛГЭЭМЖ",
  ТЭМДЭГЛЭЛ = "ТЭМДЭГЛЭЛ",
  МЭДЭЭЛЭЛ = "МЭДЭЭЛЭЛ",
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
}

export interface DailyReport {
  id: number;
  title: string;
  activity: string;
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
  content: string;
  activity: string;
  title: string;
  date: Date;
  user: User;
  createdAt: Date;
  updatedAt: Date;
}
export type QuickStat = {
  title: string;
  value: string;
  label: string;
  icon: React.ReactNode;
  link: string;
  color: string;
};
export interface TrackingItem {
  id: string;
  trackingNo: string;
  itemName: string;
  status: "PENDING" | "DELIVERED" | "IN_TRANSIT";
  createdAt: string;
  receiverName: string;
  receiverPhone: string;
  senderName: string;
  senderPhone: string;
  location: string;
  notes: string;
  weight: string;
  userId: string;
  user: {
    name: string;
  };
}
export interface User {
  name: string;
}

export interface Activity {
  date: string;
  title: string;
  user?: User;
}

export interface ReportContextType {
  dailyReports: Activity[];
  hourlyReports: Activity[];
}

export interface DeliveryContextType {
  deliveries: Activity[];
}
export interface DeliveryFormValues {
  trackingNo: string;
  itemName: string;
  status: "PENDING" | "DELIVERED" | "IN_TRANSIT";
  receiverName: string;
  receiverPhone: string;
  senderName: string;
  senderPhone: string;
  location: string;
  notes?: string;
  weight?: number | null;
}
export type Delivery = {
  id: string;
  trackingNo: string;
  itemName: string;
  status: string;
  receiverName: string;
  senderName: string;
  location: string;
  user: { name: string };
};
export interface TrackingItemData {
  trackingNo: string;
  itemName: string;
  status: "PENDING" | "DELIVERED" | "IN_TRANSIT";
  receiverName: string;
  receiverPhone: string;
  senderName: string;
  senderPhone: string;
  location: string;
  notes: string;
  weight: number;
  userId: string;
}
export interface JobRequest {
  id: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  category: string;
  location: string;
  assignedTo?: string;
  requestedBy: string;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  comments: Comment[];
}
