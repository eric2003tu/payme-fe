"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { loanOfferClient, DocumentType } from "@/lib/loanOfferClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilePlus2, FileText, Loader2, CheckCircle2 } from "lucide-react";

export default function AcceptOfferPage() {
  const router = useRouter();
  const params = useParams();
  const [documents, setDocuments] = useState([
    { documentType: DocumentType.NATIONAL_ID, documentUrl: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDocChange = (idx: number, value: string) => {
    setDocuments((docs) => {
      const newDocs = [...docs];
      newDocs[idx].documentUrl = value;
      return newDocs;
    });
  };

  const handleTypeChange = (idx: number, value: DocumentType) => {
    setDocuments((docs) => {
      const newDocs = [...docs];
      newDocs[idx].documentType = value;
      return newDocs;
    });
  };

  const addDoc = () => {
    setDocuments((docs) => [...docs, { documentType: DocumentType.NATIONAL_ID, documentUrl: "" }]);
  };

  const removeDoc = (idx: number) => {
    setDocuments((docs) => docs.length > 1 ? docs.filter((_, i) => i !== idx) : docs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const docs = documents.filter((d) => d.documentUrl.trim());
      if (docs.length === 0) {
        setError("Please provide at least one document URL.");
        setLoading(false);
        return;
      }
      const offerId = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : undefined;
      if (!offerId) {
        setError("Invalid offer ID.");
        setLoading(false);
        return;
      }
      await loanOfferClient.acceptOffer(offerId, docs);
      router.replace("/dashboard/my-loans");
    } catch (err: any) {
      setError(err?.message || "Failed to accept offer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto py-12">
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="pb-2 border-b bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-xl">
          <div className="flex items-center gap-3">
            <FileText className="text-blue-500" size={28} />
            <div>
              <CardTitle className="text-lg">Accept Loan Offer</CardTitle>
              <CardDescription className="text-slate-600">Upload at least one document to proceed</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {documents.map((doc, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-3 items-end bg-slate-50 rounded-lg p-4 border border-slate-100 relative">
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-medium mb-1 text-slate-700">Document Type</label>
                    <select
                      className="w-full border border-slate-200 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-blue-200 focus:outline-none"
                      value={doc.documentType}
                      onChange={(e) => handleTypeChange(idx, e.target.value as DocumentType)}
                    >
                      {Object.values(DocumentType).map((type) => (
                        <option key={type} value={type}>{type.replace("_", " ")}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 w-full">
                    <label className="block text-xs font-medium mb-1 text-slate-700">Document URL</label>
                    <Input
                      value={doc.documentUrl}
                      onChange={(e) => handleDocChange(idx, e.target.value)}
                      placeholder="https://..."
                      className="focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDoc(idx)}
                    disabled={documents.length === 1}
                    className="text-slate-400 hover:text-red-500"
                    aria-label="Remove document"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDoc}
              className="flex items-center gap-2"
            >
              <FilePlus2 size={16} /> Add Document
            </Button>
            {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}
            <Button
              type="submit"
              className="w-full flex items-center justify-center gap-2 text-base font-semibold"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
              {loading ? "Accepting..." : "Accept Offer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
