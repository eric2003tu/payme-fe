"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { loanRequestClient } from "@/lib/loanRequestClient";
import type { LoanRequestResponseDto } from "@/lib/loanRequestClient";
import { toast } from "sonner";
import { useParams } from "next/navigation";

// Type now imported from loanRequestClient

function money(n: number) {
	return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function fmtDate(s?: string) {
	return s ? new Date(s).toLocaleString() : "—";
}

function badgeClass(status: string) {
	const s = status.toUpperCase();
	if (s === "OPEN") return "text-blue bg-blue/10";
	if (s === "FUNDED") return "text-emerald-600 bg-emerald-100";
	if (s === "PARTIAL") return "text-amber-700 bg-amber-100";
	if (s === "CANCELLED") return "text-rose-600 bg-rose-100";
	if (s === "EXPIRED") return "text-slate-700 bg-slate-100";
	return "text-slate-700 bg-slate-100";
}

const toNum = (x: any): number => {
	if (x == null) return 0;
	const n = typeof x === "string" ? Number(x) : x;
	return Number.isFinite(n) ? n : 0;
};

export default function MyLoanRequestDetailPage() {
	const params = useParams();
	const pid = typeof params?.id === "string" ? (params.id as string) : "";
	const [data, setData] = useState<LoanRequestResponseDto | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let mounted = true;
		(async () => {
			setLoading(true);
			try {
				const res = await loanRequestClient.get(pid);
				if (mounted) setData(res as any);
			} catch (err: any) {
				toast.error(err?.message || "Failed to load request");
			} finally {
				if (mounted) setLoading(false);
			}
		})();
		return () => { mounted = false; };
	}, [pid]);

	const computed = useMemo(() => {
		if (!data) return null;
		const amount = toNum(data.amount);
		const minAmount = data.minAmount != null ? toNum(data.minAmount) : undefined;
		const funded = toNum(data.amountFunded);
		const needed = data.amountNeeded != null ? toNum(data.amountNeeded) : Math.max(amount - funded, 0);
		return { amount, minAmount, funded, needed };
	}, [data]);

	if (loading) {
		return (
			<div className="min-h-[60vh] grid place-items-center">
				<div className="h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
			</div>
		);
	}

	if (!data || !computed) {
		return (
			<div>
				<PageHeader title="Request Not Found" subtitle="We couldn’t find this request" actions={<Button asChild variant="outline" size="sm"><a href="/dashboard/my-requests">Back to list</a></Button>} />
			</div>
		);
	}

	return (
		<div>
			<PageHeader
				title={`Loan Request ${data.loanNumber ?? data.id}`}
				subtitle={`Status: ${data.status}`}
				actions={
					<div className="flex items-center gap-2">
						<Button asChild variant="outline" size="sm">
							<a href="/dashboard/my-requests">Back to list</a>
						</Button>
					</div>
				}
			/>

			<div className="grid gap-4 lg:grid-cols-3">
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle>Summary</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="rounded-lg bg-slate-50 p-4">
								<div className="text-xs text-slate-500">Amount</div>
								<div className="text-lg font-semibold">{money(computed.amount)}</div>
							</div>
							<div className="rounded-lg bg-slate-50 p-4">
								<div className="text-xs text-slate-500">Minimum Amount</div>
								<div className="text-lg font-semibold">{computed.minAmount != null ? money(computed.minAmount) : "—"}</div>
							</div>
							<div className="rounded-lg bg-slate-50 p-4">
								<div className="text-xs text-slate-500">Interest Rate</div>
								<div className="text-lg font-semibold">{toNum(data.interestRate)}% / mo</div>
							</div>
							<div className="rounded-lg bg-slate-50 p-4">
								<div className="text-xs text-slate-500">Duration</div>
								<div className="text-lg font-semibold">{toNum(data.durationDays)} days</div>
							</div>
							<div className="rounded-lg bg-slate-50 p-4">
								<div className="text-xs text-slate-500">Funded</div>
								<div className="text-lg font-semibold">{money(computed.funded)}</div>
							</div>
							<div className="rounded-lg bg-slate-50 p-4">
								<div className="text-xs text-slate-500">Needed</div>
								<div className="text-lg font-semibold">{money(computed.needed)}</div>
							</div>
						</div>

						<div className="mt-6">
							<div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${badgeClass(data.status)}`}>
								{data.status}
							</div>
							{data.purpose && (
								<p className="mt-3 text-sm text-slate-700">
									Purpose: <span className="font-medium">{data.purpose}</span>
								</p>
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Meta</CardTitle>
					</CardHeader>
					<CardContent>
						<dl className="grid grid-cols-1 gap-3 text-sm">
							<div className="flex items-center justify-between rounded-md border px-3 py-2">
								<dt className="text-slate-500">Borrower ID</dt>
								<dd className="font-medium">{data.borrowerId}</dd>
							</div>
							<div className="flex items-center justify-between rounded-md border px-3 py-2">
								<dt className="text-slate-500">Public</dt>
								<dd className="font-medium">{data.isPublic ? "Yes" : "No"}</dd>
							</div>
							<div className="flex items-center justify-between rounded-md border px-3 py-2">
								<dt className="text-slate-500">Max Lenders</dt>
								<dd className="font-medium">{data.maxLenders}</dd>
							</div>
							<div className="flex items-center justify-between rounded-md border px-3 py-2">
								<dt className="text-slate-500">Funding Deadline</dt>
								<dd className="font-medium">{fmtDate(data.fundingDeadline)}</dd>
							</div>
							<div className="flex items-center justify-between rounded-md border px-3 py-2">
								<dt className="text-slate-500">Created</dt>
								<dd className="font-medium">{fmtDate(data.createdAt)}</dd>
							</div>
							<div className="flex items-center justify-between rounded-md border px-3 py-2">
								<dt className="text-slate-500">Updated</dt>
								<dd className="font-medium">{fmtDate(data.updatedAt)}</dd>
							</div>
							<div className="flex items-center justify-between rounded-md border px-3 py-2">
								<dt className="text-slate-500">Expires</dt>
								<dd className="font-medium">{fmtDate(data.expiresAt)}</dd>
							</div>
						</dl>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
