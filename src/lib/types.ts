// Shared enums and types for API integration (mirrors Prisma schema)

// ============ ENUMS ============
export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  BLOCKED = "BLOCKED",
}

export enum MaritalStatus {
  SINGLE = "SINGLE",
  MARRIED = "MARRIED",
  DIVORCED = "DIVORCED",
  WIDOWED = "WIDOWED",
}

export enum VerificationStatus {
  PENDING = "PENDING",
  VERIFIED = "VERIFIED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export enum DocumentType {
  NATIONAL_ID = "NATIONAL_ID",
  PASSPORT = "PASSPORT",
  UTILITY_BILL = "UTILITY_BILL",
  SELFIE = "SELFIE",
  BANK_STATEMENT = "BANK_STATEMENT",
  PAYSLIP = "PAYSLIP",
}

export enum LoanStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  REPAID = "REPAID",
  DEFAULTED = "DEFAULTED",
  CANCELLED = "CANCELLED",
  OVERDUE = "OVERDUE",
  PAYMENT_INITIATED = "PAYMENT_INITIATED",
}

export enum LoanRequestStatus {
  OPEN = "OPEN",
  FUNDED = "FUNDED",
  PARTIAL = "PARTIAL",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export enum LoanOfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  WITHDRAWN = "WITHDRAWN",
}

export enum TransactionType {
  LOAN_DISBURSEMENT = "LOAN_DISBURSEMENT",
  LOAN_REPAYMENT = "LOAN_REPAYMENT",
  WALLET_DEPOSIT = "WALLET_DEPOSIT",
  WALLET_WITHDRAWAL = "WALLET_WITHDRAWAL",
  FEE = "FEE",
  PENALTY = "PENALTY",
  REFUND = "REFUND",
  GUARANTOR_PAYMENT = "GUARANTOR_PAYMENT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  STRIPE = "STRIPE",
  PAYPAL = "PAYPAL",
  FLUTTERWAVE = "FLUTTERWAVE",
  MOBILE_MONEY = "MOBILE_MONEY",
  BANK_TRANSFER = "BANK_TRANSFER",
  WALLET = "WALLET",
}

export enum NotificationType {
  LOAN_REQUEST = "LOAN_REQUEST",
  LOAN_OFFER = "LOAN_OFFER",
  LOAN_APPROVED = "LOAN_APPROVED",
  LOAN_DISBURSED = "LOAN_DISBURSED",
  REPAYMENT_REMINDER = "REPAYMENT_REMINDER",
  REPAYMENT_RECEIVED = "REPAYMENT_RECEIVED",
  LOAN_OVERDUE = "LOAN_OVERDUE",
  CATEGORY_UPDATED = "CATEGORY_UPDATED",
  VERIFICATION_STATUS = "VERIFICATION_STATUS",
  SYSTEM_ANNOUNCEMENT = "SYSTEM_ANNOUNCEMENT",
  GUARANTOR_REQUEST = "GUARANTOR_REQUEST",
}

export enum UserCategory {
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  TRUSTABLE = "TRUSTABLE",
  MODERATE = "MODERATE",
  RISKY = "RISKY",
  DEFAULT = "DEFAULT",
}

// ============ AUTH TYPES ============
export type LoginRequest = {
  email: string;
  password: string;
};
 export type ForgotRequest ={
  email: string
 }
 export type ForgotResponse ={
  otp: number;
 }

export type UserDto = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole | string;
  category?: string;
  trustScore?: number;
  profilePicture?: string | null;
  avatarUrl?: string | null;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
  user: UserDto;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  // epoch milliseconds when access token expires
  accessTokenExpiresAt: number;
  user: UserDto;
};

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

// ============ ADDRESS ============
export type GeoItem = {
  id: string;
  name: string;
  code?: string;
};
