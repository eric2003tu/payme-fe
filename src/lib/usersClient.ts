import { appClient } from "@/lib/appClient";

export interface UserAddress {
  street: string;
  latitude: number;
  longitude: number;
  country: { id: string; name: string; code: string };
  province: { id: string; name: string };
  district: { id: string; name: string };
  sector: { id: string; name: string };
  cell: { id: string; name: string };
  village: { id: string; name: string };
}

export interface User {
  id: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  category: string;
  trustScore: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  maritalStatus: string;
  nationalId: string;
  nationalIdVerified: boolean;
  profilePicture: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  totalBorrowed: string;
  totalLent: string;
  totalRepaid: string;
  currentDebt: string;
  walletBalance: string;
  totalLoansTaken: number;
  totalLoansGiven: number;
  loansPaidOnTime: number;
  loansPaidLate: number;
  loansDefaulted: number;
  avgRepaymentTime: number | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  address: UserAddress;
}

export const usersClient = {
  async getAll(): Promise<User[]> {
    return appClient.get<User[]>("/user/admin/all");
  },
};