import Link from "next/link";
import { Smartphone } from "lucide-react";

export default function MobileAppCta() {
  return (
    <div className="mt-8 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
            <Smartphone className="h-6 w-6 text-white" />
          </div>
        </div>
        <div>
          <div className="font-medium text-gray-800">Get the Mobile App</div>
          <div className="text-sm text-gray-600">Login faster with biometrics on mobile</div>
        </div>
        <Link href="/app" className="ml-auto text-sm text-amber-600 hover:text-amber-700 font-medium">
          Download →
        </Link>
      </div>
    </div>
  );
}
