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
    /**
     * Lender confirms payment received and marks loan as REPAID
     * @param id Loan ID
     * @returns Updated LoanDto
     */
    async confirmPaymentByLender(id: string): Promise<LoanDto> {
      return appClient.request<LoanDto>(`/loan/${encodeURIComponent(id)}/confirm-payment-by-lender`, { method: "PATCH" });
    },
  async meBorrowed(): Promise<LoanDto[]> {
    return appClient.get<LoanDto[]>("/loan/me/borrowed");
  },
  async meLent(): Promise<LoanDto[]> {
    return appClient.get<LoanDto[]>("/loan/me/lent");
  },
  async get(id: string): Promise<LoanDto> {
    return appClient.get<LoanDto>(`/loan/${encodeURIComponent(id)}`);
  },
  /**
   * Lender signs the loan, activating it and setting disbursement date
   * @param id Loan ID
   * @returns Updated LoanDto
   */
  async signByLender(id: string): Promise<LoanDto> {
    return appClient.request<LoanDto>(`/loan/${encodeURIComponent(id)}/sign-by-lender`, { method: "PATCH" });
  },

  /**
   * Borrower marks loan as paid (notifies lender for confirmation)
   * @param id Loan ID
   * @returns Updated LoanDto
   */
  /**
   * Borrower marks loan as paid (notifies lender for confirmation, requires payment proof document)
   * @param id Loan ID
   * @param paymentProofDocument URL string for payment proof
   * @returns Updated LoanDto
   */
  async markPaidByBorrower(id: string, paymentProofDocument: string): Promise<LoanDto> {
    return appClient.request<LoanDto>(
      `/loan/${encodeURIComponent(id)}/mark-paid-by-borrower`,
      {
        method: "PATCH",
        body: JSON.stringify({ paymentProofDocument }),
      }
    );
  },
};
