"use client";
import { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { loanOfferClient } from "@/lib/loanOfferClient";
import { toast } from "sonner";

import { loanRequestClient, LoanRequestDto } from "@/lib/loanRequestClient";

type CreateLoanOfferDto = {
  loanRequestId: string;
  amount: number;
  interestRate?: number; // % per month, default 6
  status?: string; // default PENDING
  isCounterOffer?: boolean;
  message?: string;
};

export default function OfferLoanForRequestPage() {
  const params = useParams();
  const router = useRouter();
  const loanRequestId = typeof params?.id === "string" ? (params.id as string) : "";

  // Loan request details state (must be inside component to access loanRequestId)
  const [requestDetails, setRequestDetails] = useState<LoanRequestDto | null>(null);
  const [loadingRequest, setLoadingRequest] = useState(true);

  useEffect(() => {
    if (!loanRequestId) return;
    setLoadingRequest(true);
    loanRequestClient.get(loanRequestId)
      .then(setRequestDetails)
      .catch(() => setRequestDetails(null))
      .finally(() => setLoadingRequest(false));
  }, [loanRequestId]);

  const defaultValues = useMemo<Partial<CreateLoanOfferDto>>(
    () => ({ interestRate: 6.0, status: "PENDING", isCounterOffer: false }),
    []
  );

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<CreateLoanOfferDto>({
    defaultValues: { ...defaultValues, loanRequestId },
  });

  const onSubmit = async (values: CreateLoanOfferDto) => {
    const payload: CreateLoanOfferDto = {
      loanRequestId,
      amount: Number(values.amount),
      interestRate: values.interestRate ?? 6.0,
      // Normalize status to allowed enum values; default to PENDING
      status: (() => {
        const s = (values.status ?? "PENDING").toUpperCase();
        return s === "ACCEPTED" || s === "REJECTED" || s === "WITHDRAWN" ? s : "PENDING";
      })(),
      isCounterOffer: !!values.isCounterOffer,
      message: values.message?.trim() || undefined,
    };
    try {
      // Cast payload to client input after normalization to satisfy TS union type
      const created = await loanOfferClient.create(payload as any);
      toast.success("Offer submitted");
      router.push(`/dashboard/loan-requests/${encodeURIComponent(loanRequestId)}`);
    } catch (err: any) {
      if (err?.status === 400) {
        toast.error("User documents not verified");
      } else {
        toast.error(err?.message || "Failed to submit offer");
      }
    }
  };

  return (
    <div>
      <PageHeader
        title="Offer a Loan"
        subtitle={`For request ${loanRequestId}`}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/loan-requests/${encodeURIComponent(loanRequestId)}`}>Back</Link>
          </Button>
        }
      />

      {/* Loan request details at the top */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRequest ? (
            <div className="text-slate-500">Loading request details...</div>
          ) : requestDetails ? (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Amount:</span> {requestDetails.amount}
              </div>
              <div>
                <span className="font-medium">Interest Rate:</span> {requestDetails.interestRate}%
              </div>
              <div>
                <span className="font-medium">Duration:</span> {requestDetails.durationDays} days
              </div>
              <div>
                <span className="font-medium">Purpose:</span> {requestDetails.purpose || "—"}
              </div>
            </div>
          ) : (
            <div className="text-red-500">Failed to load request details.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>New Offer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm">Amount</label>
              <Input type="number" min={0} step={1} className="mt-1" {...register("amount", { valueAsNumber: true, required: true })} />
            </div>
            <div>
              <label className="text-sm">Interest Rate (%)</label>
              <Input type="number" step={0.1} className="mt-1" {...register("interestRate", { valueAsNumber: true })} />
            </div>
            <div>
              <label className="text-sm">Status</label>
              <Input className="mt-1" placeholder="PENDING" {...register("status")} />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" {...register("isCounterOffer")} />
              <span className="text-sm">Counter Offer</span>
            </div>
            <div className="md:col-span-2">
              <label className="text-sm">Message</label>
              <Textarea className="mt-1" rows={4} placeholder="Optional note to borrower" {...register("message")} />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={isSubmitting}>Submit Offer</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
