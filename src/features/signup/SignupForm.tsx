"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type FieldErrors, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Shield, Users, User, ChevronRight } from "lucide-react";
import { schema, type FormData } from "@/features/signup/schema";
import { DocumentType } from "@/features/signup/constants";
import { LeftPanel } from "@/features/signup/components/LeftPanel";
import { ProgressSteps, type Step } from "@/features/signup/components/ProgressSteps";
import { StepPersonal } from "@/features/signup/components/steps/StepPersonal";
import { StepAddress } from "@/features/signup/components/steps/StepAddress";
import { StepFamily } from "@/features/signup/components/steps/StepFamily";
import { StepDocuments } from "@/features/signup/components/steps/StepDocuments";
import { authClient } from "@/lib/authClient";
import { toast } from "sonner";

export function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedDocuments, setSelectedDocuments] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const { register, handleSubmit, formState: { errors, isSubmitting }, watch, setValue, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { maritalStatus: "Single", address: { latitude: -1.9441, longitude: 30.0619 } },
  });

  const steps: Step[] = [
    { number: 1, title: "Personal Info", icon: User, color: "from-amber-500 to-orange-500" },
    { number: 2, title: "Address", icon: MapPin, color: "from-teal-500 to-emerald-500" },
    { number: 3, title: "Family", icon: Users, color: "from-rose-500 to-pink-500" },
    { number: 4, title: "Verification", icon: Shield, color: "from-blue-600 to-indigo-600" },
  ];

  const simulateUpload = (docType: string) => {
    setUploadProgress((prev) => ({ ...prev, [docType]: 0 }));
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const next = (prev[docType] ?? 0) + 10;
        if (next >= 100) {
          clearInterval(interval);
          const url = `https://cdn.example.com/docs/${docType.toLowerCase()}_${Date.now()}.png`;
          setSelectedDocuments((p) => ({ ...p, [docType]: url }));
          return { ...prev, [docType]: 100 };
        }
        return { ...prev, [docType]: next };
      });
    }, 200);
  };

  const buildSignupPayload = (data: FormData) => {
    const verificationDocuments = Object.entries(selectedDocuments)
      .filter(([, url]) => url)
      .map(([documentType, documentUrl]) => ({ documentType: documentType as keyof typeof DocumentType, documentUrl }));

    return {
      ...data,
      maritalStatus: data.maritalStatus.toUpperCase(),
      verificationDocuments,
    } as any;
  };

  const onSubmit = async (data: FormData) => {
    const payload = buildSignupPayload(data);

    if (payload.verificationDocuments?.some((d: any) => !(d.documentUrl?.startsWith("https://")))) {
      toast.error("Verification document URLs must use HTTPS");
      return;
    }

    try {
      await authClient.register(payload);
      const docsCount = payload.verificationDocuments?.length ?? 0;
      toast.success(`Account created successfully (${docsCount} document${docsCount === 1 ? "" : "s"} attached). Please sign in.`);
      router.push("/auth/login");
    } catch (e: any) {
      const msg = e?.message || "Registration failed. Please try again.";
      toast.error(msg);
    }
  };

  const onError = (errs: FieldErrors<FormData>) => {
    // Determine which step to focus based on where errors occurred
    const personalKeys = [
      "email",
      "phone",
      "password",
      "firstName",
      "lastName",
      "dateOfBirth",
      "maritalStatus",
      "nationalId",
    ];
    const hasPersonalError = personalKeys.some((k) => !!(errs as any)[k]);
    const hasAddressError = !!errs.address;
    const hasFamilyError = !!errs.familyDetails;

    const targetStep = hasPersonalError ? 1 : hasAddressError ? 2 : hasFamilyError ? 3 : step;
    if (targetStep !== step) setStep(targetStep);
    toast.error("Please fix the highlighted fields before submitting");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <StepPersonal register={register} errors={errors} />;
      case 2:
        return <StepAddress register={register} errors={errors} watch={watch} setValue={setValue} />;
      case 3:
        return <StepFamily register={register} errors={errors} watch={watch} setValue={setValue} />;
      case 4:
        return (
          <StepDocuments
            selectedDocuments={selectedDocuments}
            uploadProgress={uploadProgress}
            simulateUpload={simulateUpload}
            setSelectedDocuments={setSelectedDocuments}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12">
          <LeftPanel />
          <div className="relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                <span className="font-medium">PayMeNow</span>
                <ChevronRight className="h-4 w-4" />
                <span>Sign Up</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">Create Your Account</h1>
              <p className="text-gray-600">Join thousands who trust PayMeNow for secure peer-to-peer lending. Fill in your details to get started.</p>
            </motion.div>
            <ProgressSteps step={step} steps={steps} />
            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
              <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
              {isSubmitting && (
                <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex items-center gap-3 text-gray-700">
                    <div className="h-5 w-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                    Processing your signup...
                  </div>
                </div>
              )}
              <div className="flex justify-between pt-6 border-t border-gray-200">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep(step - 1)} disabled={isSubmitting} className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                    Back
                  </button>
                ) : (
                  <div />
                )}
                {step < steps.length ? (
                  <button
                    type="button"
                    onClick={async () => {
                      const stepFields: Record<number, FieldPath<FormData>[]> = {
                        1: [
                          "email",
                          "phone",
                          "password",
                          "firstName",
                          "lastName",
                          "dateOfBirth",
                          "maritalStatus",
                          "nationalId",
                        ],
                        2: [
                          "address.countryId",
                          "address.provinceId",
                          "address.districtId",
                          "address.sectorId",
                          "address.cellId",
                          "address.villageId",
                          "address.street",
                        ],
                        3: [
                          "familyDetails.emergencyContactName",
                          "familyDetails.emergencyContactPhone",
                          "familyDetails.emergencyContactRelation",
                        ],
                        4: [],
                      };
                      const ok = await trigger(stepFields[step], { shouldFocus: true });
                      if (!ok) {
                        toast.error("Please complete required fields in this step");
                        return;
                      }
                      setStep(step + 1);
                    }}
                    disabled={isSubmitting}
                    className={`px-6 py-3 text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-md ${
                      step === 1
                        ? "bg-blue-500"
                        : step === 2
                        ? "bg-blue-500"
                        : step === 3
                        ? "bg-blue-500"
                        : "bg-blue-500"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:opacity-90 transition-all font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      "Complete Sign Up"
                    )}
                  </button>
                )}
              </div>
            </form>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600">
                Already have an account? <a href="/auth/login" className="text-blue-600 font-medium hover:text-blue-700">Sign in here</a>
              </p>
              <p className="text-center text-xs text-gray-500 mt-2">By creating an account, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
