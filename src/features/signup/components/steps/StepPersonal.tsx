"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Lock, Mail, User, Users, Eye, EyeOff, Phone } from "lucide-react";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { FormData } from "@/features/signup/schema";

export function StepPersonal({ register, errors }: { register: UseFormRegister<FormData>; errors: FieldErrors<FormData> }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
            <User className="h-4 w-4 text-gray-600" /> First Name
          </label>
          <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white" {...register("firstName")} placeholder="John" />
          {errors.firstName && <p className="mt-1 text-sm text-rose-600">{errors.firstName.message}</p>}
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-800 mb-2">Last Name</label>
          <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white" {...register("lastName")} placeholder="Doe" />
          {errors.lastName && <p className="mt-1 text-sm text-rose-600">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-600" /> Email Address
        </label>
        <input type="email" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white" {...register("email")} placeholder="john.doe@example.com" />
        {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-600" /> Phone Number
        </label>
        <input
          type="tel"
          inputMode="tel"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white"
          {...register("phone")}
          placeholder="+250788123456"
        />
        {errors.phone && <p className="mt-1 text-sm text-rose-600">{errors.phone.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
          <Lock className="h-4 w-4 text-gray-600" /> Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white pr-12"
            {...register("password")}
            placeholder="••••••••"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600" /> Date of Birth
          </label>
          <input type="date" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white" {...register("dateOfBirth")} />
          {errors.dateOfBirth && <p className="mt-1 text-sm text-rose-600">{errors.dateOfBirth.message as string}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-600" /> Marital Status
          </label>
          <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white" {...register("maritalStatus")}>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
          {errors.maritalStatus && <p className="mt-1 text-sm text-rose-600">{errors.maritalStatus.message as string}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">National ID</label>
        <input type="text" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white" {...register("nationalId")} placeholder="1234567890123456" />
        {errors.nationalId && <p className="mt-1 text-sm text-rose-600">{errors.nationalId.message as string}</p>}
      </div>
    </motion.div>
  );
}
