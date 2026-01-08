import { appClient } from "./appClient";

export type CreateLoanOfferInput = {
  loanRequestId: string;
  amount: number;
  interestRate?: number;
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  isCounterOffer?: boolean;
  message?: string;
};

export type LoanOfferDto = {
  id: string;
  loanRequestId: string;
  lenderId: string;
  amount: number | string;
  interestRate: number | string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN" | string;
  isCounterOffer: boolean;
  message?: string;
  createdAt: string;
  updatedAt: string;
};

export const loanOfferClient = {
  async create(payload: CreateLoanOfferInput): Promise<LoanOfferDto> {
    // Default status to PENDING if not provided
    const body = { status: "PENDING", ...payload };
    return appClient.post<LoanOfferDto>("/loan-offers", body, { showErrorToast: true });
  },
  async mine(): Promise<LoanOfferDto[]> {
    return appClient.get<LoanOfferDto[]>("/loan-offers/me");
  },
  async get(id: string): Promise<LoanOfferDto & { loanRequest?: any }> {
    return appClient.get<LoanOfferDto & { loanRequest?: any }>(`/loan-offers/${encodeURIComponent(id)}`);
  },
};
