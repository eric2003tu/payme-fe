"use client";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type CreateLoanOfferDto = {
  loanRequestId: string;
  amount: number;
  interestRate?: number; // % per month, default 6
  status?: string; // default PENDING
  isCounterOffer?: boolean;
  message?: string;
};

export default function OfferLoanForRequestPage({ params }: { params: { id: string } }) {
  const loanRequestId = params.id;

  const defaultValues = useMemo<Partial<CreateLoanOfferDto>>(
    () => ({ interestRate: 6.0, status: "PENDING", isCounterOffer: false }),
    []
  );

  const { register, handleSubmit, formState: { isSubmitting } } = useForm<CreateLoanOfferDto>({
    defaultValues: { ...defaultValues, loanRequestId },
  });

  const onSubmit = (values: CreateLoanOfferDto) => {
    const payload: CreateLoanOfferDto = {
      loanRequestId,
      amount: Number(values.amount),
      interestRate: values.interestRate ?? 6.0,
      status: values.status || "PENDING",
      isCounterOffer: !!values.isCounterOffer,
      message: values.message?.trim() || undefined,
    };
    console.log("CreateLoanOfferDto", payload);
    // TODO: POST to API endpoint when available
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
