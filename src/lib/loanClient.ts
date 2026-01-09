import { appClient } from "./appClient";
import { LoanStatus } from "./types";

export type GeoRef = { id: string; name: string; code?: string };

export type PartyAddress = {
  street?: string;
  latitude?: number;
  longitude?: number;
  country?: GeoRef;
  province?: GeoRef;
  district?: GeoRef;
  sector?: GeoRef;
  cell?: GeoRef;
  village?: GeoRef;
};

export type FamilyDetails = {
  spouseName?: string | null;
  spouseNationalId?: string | null;
  spousePhone?: string | null;
  fatherName?: string | null;
  motherName?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  emergencyContactRelation?: string | null;
};

export type PartyDto = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  nationalId?: string;
  profilePicture?: string | null;
  trustScore?: number;
  category?: string;
  address?: PartyAddress;
  familyDetails?: FamilyDetails;
};

export type LoanDto = {
  id: string;
  loanNumber: string;
  borrowerId: string;
  lenderId: string;
  amount: number | string;
  interestRate: number | string;
  durationDays: number;
  purpose?: string;
  disbursedAt?: string | null;
  dueDate?: string | null;
  repaidAt?: string | null;
  totalAmount: number | string;
  amountPaid: number | string;
  amountDue: number | string;
  status: LoanStatus | string;
  isLate?: boolean;
  lateDays?: number;
  penaltyAmount?: number | string;
  agreementUrl?: string | null;
  signedByBorrower?: boolean;
  signedByLender?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
  borrower?: PartyDto;
  lender?: PartyDto;
};

export const loanClient = {
  async meBorrowed(): Promise<LoanDto[]> {
    return appClient.get<LoanDto[]>("/loan/me/borrowed");
  },
  async meLent(): Promise<LoanDto[]> {
    return appClient.get<LoanDto[]>("/loan/me/lent");
  },
  async get(id: string): Promise<LoanDto> {
    return appClient.get<LoanDto>(`/loan/${encodeURIComponent(id)}`);
  },
};
