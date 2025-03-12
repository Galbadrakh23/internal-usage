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
export interface ReportListProps {
  dailyReports: Report[];
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

export interface JobRequestData {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  category: string;
  location: string;
  assignedTo?: string;
  requestedBy: string;
  dueDate?: string;
}

export enum ReportStatus {
  ӨДРИЙН = "DAILY",
  ЦАГИЙН = "HOURLY",
  ТЭМДЭГЛЭЛ = "IMPORTANT",
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
export interface Report {
  id: number;
  title: string;
  activity: string;
  status: "DAILY" | "HOURLY" | "IMPORTANT";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  date: Date;
  comments: string;
  user: {
    name: string;
  };
}
export interface CreateReportData {
  title: string;
  activity: string;
  content: string;
  date: Date;
  status: "DAILY" | "HOURLY" | "IMPORTANT";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  comments: string;
  user: {
    name: string;
  };
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
  status: "PENDING" | "DELIVERED";
  date: string;
  createdAt: Date;
  receiverName: string;
  receiverPhone: string;
  senderName: string;
  senderPhone: string;
  location: string;
  notes: string;
  userId: string;
  user: {
    name: string;
  };
  weight: string;
}
export interface User {
  userId: string;
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  avatar: string;
}

export interface Activity {
  date: string;
  title: string;
  user?: User;
}

export interface ReportContextType {
  Reports: Activity[];
}

export interface DeliveryContextType {
  deliveries: Activity[];
}
export interface DeliveryFormValues {
  trackingNo: string;
  itemName: string;
  status: "PENDING" | "DELIVERED";
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
  status: "PENDING" | "DELIVERED";
  receiverName: string;
  date: string;
  weight: string;
  senderName: string;
  createdAt: Date;
  receiverPhone: string;
  senderPhone: string;
  notes: string;
  userId: string;
  location: string;
  user: { name: string }; // Updated to match TrackingItem type
};

export type Patrol = {
  id: string;
  notes: string;
  imagePath: string;
  status: string;
  totalCheckPoint: number;
  user: { name: string };
  propertyId: { id: string };
  property: { name: string };
  createdAt: string;
};

export interface TimeReport {
  id: string | number;
  date: Date | string;
  hours: number;
  project: string;
  description?: string;
  status: string;
  userId: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  user: {
    name: string;
  };
}

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
  userId: string;
  weight: number;
}
export interface JobRequest {
  id: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN";
  category: string;
  location: string;
  assignedTo?: string;
  requestedBy: string;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
  };
  comments: Comment[];
}
export interface CreateJobRequestInput {
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  category: string;
  location?: string;
  assignedTo?: string;
  dueDate?: Date;
  requestedBy: string;
}
