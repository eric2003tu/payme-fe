
"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { docsClient, DocumentType, VerificationDoc } from "@/lib/docsClient";

function getStatusAccent(status: string) {
  switch (status) {
    case "VERIFIED": return "green";
    case "REJECTED": return "pink";
    default: return "orange";
  }
}

export default function ApprovalsAdminPage() {
  const [docs, setDocs] = useState<VerificationDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<{ [id: string]: string }>({});

  useEffect(() => {
    setLoading(true);
    docsClient.getAll()
      .then(setDocs)
      .catch(() => setError("Failed to load documents."))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await docsClient.approveDoc(id);
      setDocs(docs => docs.map(d => d.id === id ? { ...d, status: "VERIFIED" } : d));
      toast.success("Document approved.");
    } catch {
      toast.error("Failed to approve document.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!rejectReason[id]) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    setActionLoading(id);
    try {
      await docsClient.rejectDoc(id, rejectReason[id]);
      setDocs(docs => docs.map(d => d.id === id ? { ...d, status: "REJECTED", rejectionReason: rejectReason[id] } : d));
      toast.success("Document rejected.");
    } catch {
      toast.error("Failed to reject document.");
    } finally {
      setActionLoading(null);
    }
  };

  const pending = docs.filter(d => d.status === "PENDING").length;
  const approved = docs.filter(d => d.status === "VERIFIED").length;
  const rejected = docs.filter(d => d.status === "REJECTED").length;

  return (
    <div>
      <PageHeader title="Approvals" subtitle="Admin: document verification queue" />
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard title="Pending" value={pending} accent="orange" />
        <StatCard title="Approved" value={approved} accent="green" />
        <StatCard title="Rejected" value={rejected} accent="pink" />
      </div>
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="text-center text-muted-foreground py-12">Loading...</div>
        ) : error ? (
          <div className="text-center text-destructive py-12">{error}</div>
        ) : docs.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">No verification documents found.</div>
        ) : (
          docs.map(doc => (
            <Card key={doc.id} className="">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    {doc.documentType.replace(/_/g, ' ')}
                  </CardTitle>
                  <CardDescription>
                    Uploaded by: <span className="font-medium">{doc.user.firstName} {doc.user.lastName}</span> &lt;{doc.user.email}&gt;
                  </CardDescription>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-${getStatusAccent(doc.status)}-100 text-${getStatusAccent(doc.status)}-700`}>
                  {doc.status}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-2">
                <div>
                  <span className="font-medium">Document:</span>{' '}
                  <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a>
                </div>
                <div className="text-xs text-muted-foreground">Uploaded: {new Date(doc.createdAt).toLocaleString()}</div>
                {doc.status === "REJECTED" && doc.rejectionReason && (
                  <div className="text-xs text-destructive">Reason: {doc.rejectionReason}</div>
                )}
              </CardContent>
              {doc.status === "PENDING" && (
                <CardFooter className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center">
                  <Button
                    variant="outline"
                    disabled={actionLoading === doc.id}
                    onClick={() => handleApprove(doc.id)}
                  >
                    {actionLoading === doc.id ? "Approving..." : "Approve"}
                  </Button>
                  <div className="flex flex-col gap-1 w-full md:w-auto">
                    <Textarea
                      placeholder="Rejection reason"
                      value={rejectReason[doc.id] || ""}
                      onChange={e => setRejectReason(r => ({ ...r, [doc.id]: e.target.value }))}
                      rows={2}
                      className="min-w-[180px]"
                      disabled={actionLoading === doc.id}
                    />
                    <Button
                      variant="destructive"
                      disabled={actionLoading === doc.id}
                      onClick={() => handleReject(doc.id)}
                    >
                      {actionLoading === doc.id ? "Rejecting..." : "Reject"}
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
