"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, CheckCircle2, FileText, Shield, Upload, Link2, Save } from "lucide-react";
import { DocumentType } from "@/features/signup/constants";
import { toast } from "sonner";

export function StepDocuments({
  selectedDocuments,
  uploadProgress,
  simulateUpload,
  setSelectedDocuments,
}: {
  selectedDocuments: Record<string, string>;
  uploadProgress: Record<string, number>;
  simulateUpload: (docType: string) => void;
  setSelectedDocuments: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}) {
  const [urlInputs, setUrlInputs] = useState<Record<string, string>>({});

  const saveUrl = (key: string) => {
    const value = (urlInputs[key] || "").trim();
    if (!value) {
      toast.error("Please enter a document URL");
      return;
    }
    try {
      const u = new URL(value);
      if (u.protocol !== "https:") {
        toast.error("Document URL must start with https://");
        return;
      }
      setSelectedDocuments((prev) => ({ ...prev, [key]: value }));
      toast.success("Document URL saved");
    } catch {
      toast.error("Please enter a valid URL (https://...)");
    }
  };
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" /> Upload Verification Documents
        </h3>
        <p className="text-sm text-gray-600">Upload required documents for verification. All documents must be clear and valid.</p>
      </div>

      <div className="grid gap-4">
        {Object.entries(DocumentType).map(([key, value]) => (
          <div key={key} className="border border-gray-200 rounded-xl p-4 hover:border-blue-500 transition-colors bg-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedDocuments[key] ? "bg-emerald-100 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                  {key === "SELFIE" ? <Camera className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{value.replace(/_/g, " ")}</div>
                  <div className="text-sm text-gray-500">{key === "SELFIE" ? "Clear selfie photo" : "PDF, PNG or JPEG"}</div>
                </div>
              </div>
              {selectedDocuments[key] ? (
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Uploaded</span>
                </div>
              ) : (
                <button type="button" onClick={() => simulateUpload(key)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  <Upload className="inline h-4 w-4 mr-2" /> Upload
                </button>
              )}
            </div>
            {uploadProgress[key] !== undefined && uploadProgress[key] < 100 && (
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300" style={{ width: `${uploadProgress[key]}%` }} />
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">{uploadProgress[key]}%</div>
              </div>
            )}
            {selectedDocuments[key] && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 truncate">{selectedDocuments[key]}</div>
                <div className="flex justify-between mt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedDocuments((prev) => {
                      const n = { ...prev };
                      delete n[key];
                      return n;
                    })}
                    className="text-sm text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                  <button type="button" onClick={() => simulateUpload(key)} className="text-sm text-blue-600 hover:text-blue-700">
                    Replace
                  </button>
                </div>
              </div>
            )}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="url"
                  inputMode="url"
                  placeholder="https://cdn.example.com/docs/document.pdf"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white pl-10"
                  value={urlInputs[key] ?? ""}
                  onChange={(e) => setUrlInputs((p) => ({ ...p, [key]: e.target.value }))}
                />
                <Link2 className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <button
                type="button"
                onClick={() => saveUrl(key)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <Save className="h-4 w-4" /> Save URL
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <div className="font-medium text-blue-700 mb-1">Security Notice</div>
            <div className="text-sm text-gray-600">All documents are encrypted and stored securely. We never share your personal information with third parties without your consent.</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
