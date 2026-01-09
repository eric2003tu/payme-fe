// lib/docsClient.ts
import { appClient } from "@/lib/appClient";

export enum DocumentType {
  NATIONAL_ID = 'NATIONAL_ID',
  PASSPORT = 'PASSPORT',
  UTILITY_BILL = 'UTILITY_BILL',
  SELFIE = 'SELFIE',
  BANK_STATEMENT = 'BANK_STATEMENT',
  PAYSLIP = 'PAYSLIP',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationalIdVerified: boolean;
}

export interface VerificationDoc {
  id: string;
  userId: string;
  documentType: DocumentType;
  documentUrl: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy: string | null;
  verifiedAt: string | null;
  rejectionReason: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user: User;
}

const API_URL = 'verification-docs';

export const docsClient = {
  async getAll(): Promise<VerificationDoc[]> {
    return appClient.get<VerificationDoc[]>(`/${API_URL}`);
  },
  async approveDoc(id: string) {
    // PATCH method for approve
    return appClient.request<VerificationDoc>(`/${API_URL}/${id}/approve`, { method: "PATCH", body: JSON.stringify({}) });
  },
  async rejectDoc(id: string, reason: string) {
    // PATCH method for reject
    return appClient.request<VerificationDoc>(`/${API_URL}/${id}/reject`, { method: "PATCH", body: JSON.stringify({ reason }) });
  },
};
