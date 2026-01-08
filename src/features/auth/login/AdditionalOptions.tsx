import Link from "next/link";
import { Smartphone, Key } from "lucide-react";

export default function AdditionalOptions() {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <p className="text-center text-sm text-gray-600 mb-4">
        Don't have an account? <Link href="/auth/signup" className="text-blue-600 font-medium hover:text-blue-700">Sign up for free</Link>
      </p>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/auth/mobile-login" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          <Smartphone className="h-4 w-4" />
          Mobile Login
        </Link>
        <Link href="/auth/recovery" className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          <Key className="h-4 w-4" />
          Recovery Options
        </Link>
      </div>

      <p className="text-center text-xs text-gray-500 mt-4">
        By signing in, you agree to our <Link href="/terms" className="text-blue-600 hover:text-blue-700">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:text-blue-700">Privacy Policy</Link>
      </p>
    </div>
  );
}
