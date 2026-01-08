import { appClient } from "./appClient";

export type CreateLoanRequestInput = {
  amount: number;
  minAmount?: number;
  interestRate: number;
  durationDays: number;
  purpose?: string;
  isPublic?: boolean;
  maxLenders?: number;
  fundingDeadline?: string; // ISO string
  expiresAt?: string; // ISO string
};

export type LoanRequestDto = {
  id: string;
  borrowerId: string;
  loanNumber?: string;
  amount: number | string;
  minAmount?: number | string;
  interestRate: number | string;
  durationDays: number | string;
  purpose?: string;
  amountFunded: number | string;
  amountNeeded: number | string;
  status: string; // OPEN | FUNDED | PARTIAL | CANCELLED | EXPIRED
  fundingDeadline?: string;
  isPublic: boolean;
  maxLenders: number;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
};

// Alias matching the page/component expectation
export type LoanRequestResponseDto = LoanRequestDto;

export const loanRequestClient = {
  async create(payload: CreateLoanRequestInput): Promise<LoanRequestDto> {
    // Server may compute amountFunded/amountNeeded/status; send only meaningful inputs
    return appClient.post<LoanRequestDto>("/loan-request", payload, { showErrorToast: true });
  },
  async list(): Promise<LoanRequestDto[]> {
    return appClient.get<LoanRequestDto[]>("/loan-request");
  },
  async mine(): Promise<LoanRequestDto[]> {
    return appClient.get<LoanRequestDto[]>("/loan-request/me");
  },
  async get(id: string): Promise<LoanRequestDto> {
    return appClient.get<LoanRequestDto>(`/loan-request/${encodeURIComponent(id)}`);
  },
};
