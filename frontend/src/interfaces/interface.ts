export interface ILogin {
  email: string;
  password: string;
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
  id: string;
  name: string;
  position: string;
  email: string;
  company: {
    name: string;
  };
  phone: string;
}
export interface Company {
  id: string;
  name: string;
}

export interface DeliveryTableProps {
  data: Delivery[];
  fetchDeliveries: (page?: number, limit?: number) => Promise<void>;
  onPageChange: (page: number) => void;
}
export interface MealCountTableProps {
  mealCounts: MealCount[];
  fetchMealCounts: (page?: number, limit?: number) => Promise<void>;
  onPageChange: (newPage: number) => void;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface JobRequestData {
  id: { id: string };
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "REJECTED";
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
  content: string;
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
  checkedBy: string;
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
export interface MealCount {
  id: string;
  date: string;
  breakfast: number;
  lunch: number;
  dinner: number;
}

export interface TrackingItemData {
  trackingNo: string;
  itemName: string;
  status: "PENDING" | "DELIVERED" | "IN_TRANSIT";
  receiverName: string | undefined;
  receiverPhone: string | undefined;
  senderName: string | undefined;
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
  priority: Priority;
  status: JobStatus;
  category: string;
  location: string;
  assignedTo?: string;
  requestedBy: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  comments: JobRequestComment[];
  user: User;
  assignedToUser?: User;
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
export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum JobStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}
export interface JobRequestComment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
}
