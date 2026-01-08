"use client";
import LeftPanel from "@/features/auth/login/LeftPanel";
import AuthHeader from "@/features/auth/login/AuthHeader";
import SocialButtons from "@/features/auth/login/SocialButtons";
import LoginForm from "@/features/auth/login/LoginForm";
import AdditionalOptions from "@/features/auth/login/AdditionalOptions";
import MobileAppCta from "@/features/auth/login/MobileAppCta";

export default function LoginPage() {
  // Form handles submission and toasts internally

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12">
          <LeftPanel />
          <div>
            <AuthHeader title="Welcome Back" subtitle="Sign in to your account to continue your financial journey." />
            <SocialButtons />
            <LoginForm />
            <AdditionalOptions />
            <MobileAppCta />
          </div>
        </div>
      </div>
    </div>
  );
}