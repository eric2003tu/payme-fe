"use client";
import Image from "next/image";
import { Bell, Smartphone, Zap } from "lucide-react";

export default function MobileAppPreview() {
  return (
    <div className="container-fluid py-16 bg-gradient-to-r from-blue/5 to-pink/5 rounded-3xl my-16">
      <div className="grid gap-12 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-3xl font-bold">Manage Everything On The Go</h2>
          <p className="mt-4 text-slate-600">Our mobile app puts your entire lending portfolio in your pocket. Available for iOS and Android.</p>
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-blue" />
              <span>Real-time loan alerts and updates</span>
            </div>
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-blue" />
              <span>Biometric authentication for security</span>
            </div>
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-blue" />
              <span>Instant approval for repeat borrowers</span>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800">Download for iOS</button>
            <button className="rounded-lg border border-black px-6 py-3 hover:bg-gray-50">Download for Android</button>
          </div>
        </div>
        <div className="relative">
          <div className="relative h-[500px]">
            <Image src="https://images.unsplash.com/photo-1558655146-364adaf1fcc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Mobile app interface showing loan management" fill className="object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}
