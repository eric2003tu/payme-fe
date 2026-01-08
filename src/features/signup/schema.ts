import { z } from "zod";

export const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[+]?\d{7,15}$/i, "Please enter a valid phone number"),
  password: z.string().min(8).max(128),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  maritalStatus: z.enum(["Single", "Married", "Divorced", "Widowed"]),
  nationalId: z.string().min(5),
  address: z.object({
    countryId: z.string().min(1),
    provinceId: z.string().min(1),
    districtId: z.string().min(1),
    sectorId: z.string().min(1),
    cellId: z.string().min(1),
    villageId: z.string().min(1),
    street: z.string().min(3),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
  }),
  familyDetails: z.object({
    spouseName: z.string().optional(),
    spouseNationalId: z.string().optional(),
    spousePhone: z.string().optional(),
    fatherName: z.string().optional(),
    fatherNationalId: z.string().optional(),
    fatherPhone: z.string().optional(),
    motherName: z.string().optional(),
    motherNationalId: z.string().optional(),
    motherPhone: z.string().optional(),
    emergencyContactName: z.string().min(2),
    emergencyContactPhone: z
      .string()
      .regex(/^[+]?\d{7,15}$/i, "Please enter a valid phone number"),
    emergencyContactRelation: z.string().min(2),
  }),
});

export type FormData = z.infer<typeof schema>;
