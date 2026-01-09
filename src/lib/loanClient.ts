import { appClient } from "./appClient";
import { LoanStatus } from "./types";

export type PartyDto = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
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
