"use client";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Users } from "lucide-react";
import type { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from "react-hook-form";
import type { FormData } from "@/features/signup/schema";

export function StepFamily({ register, errors, watch, setValue }: { register: UseFormRegister<FormData>; errors: FieldErrors<FormData>; watch: UseFormWatch<FormData>; setValue: UseFormSetValue<FormData>; }) {
  const maritalStatus = watch("maritalStatus");

  useEffect(() => {
    if (maritalStatus !== "Married") {
      setValue("familyDetails.spouseName", "");
      setValue("familyDetails.spouseNationalId", "");
      setValue("familyDetails.spousePhone", "");
    }
  }, [maritalStatus, setValue]);

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Users className="h-5 w-5 text-rose-500" /> Spouse Details
        </h3>
        <p className="text-sm text-gray-500">
          {maritalStatus === "Married"
            ? "Provide your spouse details for verification."
            : "These fields are disabled unless your marital status is Married."}
        </p>
      </div>
      <div className={`grid grid-cols-2 gap-4 ${maritalStatus === "Married" ? "" : "opacity-60"}`}>
        <TextInput disabled={maritalStatus !== "Married"} label="Spouse Name" placeholder="Jane Doe" {...{ registerPath: "familyDetails.spouseName", register }} />
        <TextInput disabled={maritalStatus !== "Married"} label="Spouse National ID" placeholder="1234567890123456" {...{ registerPath: "familyDetails.spouseNationalId", register }} />
        <TextInput disabled={maritalStatus !== "Married"} label="Spouse Phone" placeholder="+250788123456" {...{ registerPath: "familyDetails.spousePhone", register }} />
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800">Parents Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Father's Name" placeholder="James Doe" {...{ registerPath: "familyDetails.fatherName", register }} />
          <TextInput label="Father's National ID" placeholder="1234567890123456" {...{ registerPath: "familyDetails.fatherNationalId", register }} />
          <TextInput label="Father's Phone" placeholder="+250788123457" {...{ registerPath: "familyDetails.fatherPhone", register }} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Mother's Name" placeholder="Mary Doe" {...{ registerPath: "familyDetails.motherName", register }} />
          <TextInput label="Mother's National ID" placeholder="1234567890123456" {...{ registerPath: "familyDetails.motherNationalId", register }} />
          <TextInput label="Mother's Phone" placeholder="+250788123458" {...{ registerPath: "familyDetails.motherPhone", register }} />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Heart className="h-5 w-5 text-rose-500" /> Emergency Contact
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Contact Name *" placeholder="Emergency Contact" {...{ registerPath: "familyDetails.emergencyContactName", register }} error={errors.familyDetails?.emergencyContactName?.message as string} />
          <TextInput label="Phone Number *" placeholder="+250788123459" {...{ registerPath: "familyDetails.emergencyContactPhone", register }} error={errors.familyDetails?.emergencyContactPhone?.message as string} />
          <TextInput label="Relationship *" placeholder="Sister, Brother, Friend" {...{ registerPath: "familyDetails.emergencyContactRelation", register }} error={errors.familyDetails?.emergencyContactRelation?.message as string} />
        </div>
      </div>
    </motion.div>
  );
}

function TextInput({ label, placeholder, registerPath, register, error, disabled }: { label: string; placeholder?: string; registerPath: any; register: any; error?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-2">{label}</label>
      <input
        type="text"
        disabled={disabled}
        className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
        {...register(registerPath)}
        placeholder={placeholder}
      />
      {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
