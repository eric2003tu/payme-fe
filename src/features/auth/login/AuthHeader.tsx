import Link from "next/link";
import { ChevronRight } from "lucide-react";

type AuthHeaderProps = {
  title: string;
  subtitle: string;
  crumbLabel?: string;
};

export default function AuthHeader({ title, subtitle, crumbLabel = "Login" }: AuthHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Link href="/" className="font-medium hover:text-gray-800 transition-colors">
          PayMeNow
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>{crumbLabel}</span>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
}
