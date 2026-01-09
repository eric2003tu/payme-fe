import { appClient } from "./appClient";


export type CreateLoanOfferInput = {
  loanRequestId: string;
  amount: number;
  interestRate?: number;
  status?: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  isCounterOffer?: boolean;
  message?: string;
};

export enum DocumentType {
  NATIONAL_ID = "NATIONAL_ID",
  PASSPORT = "PASSPORT",
  UTILITY_BILL = "UTILITY_BILL",
  SELFIE = "SELFIE",
  BANK_STATEMENT = "BANK_STATEMENT",
  PAYSLIP = "PAYSLIP",
}

export type AcceptOfferDocument = {
  documentType: DocumentType;
  documentUrl: string;
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
  // Optional relations (when expanded by API)
  loanRequest?: any;
  lender?: any;
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
  async myRequests(): Promise<LoanOfferDto[]> {
    return appClient.get<LoanOfferDto[]>("/loan-offers/my-requests");
  },
  async get(id: string): Promise<LoanOfferDto & { loanRequest?: any }> {
    return appClient.get<LoanOfferDto & { loanRequest?: any }>(`/loan-offers/${encodeURIComponent(id)}`);
  },
  async acceptOffer(offerId: string, documents: AcceptOfferDocument[]): Promise<any> {
    return appClient.post(
      `/loan/accept-offer/${encodeURIComponent(offerId)}`,
      { documents },
      { showErrorToast: true }
    );
  },
};


