"use client";

import { Badge } from "@/components/ui/badge";
import { QueueStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: QueueStatus }) {
  const variants: Record<QueueStatus, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-amber-500/20 text-amber-500 border-amber-500/50" },
    approved: { label: "Waiting", className: "bg-primary/20 text-primary border-primary/50" },
    serving: { label: "Current", className: "bg-accent/20 text-accent border-accent/50 animate-pulse" },
    served: { label: "Served", className: "bg-emerald-500/20 text-emerald-500 border-emerald-500/50" },
    skipped: { label: "Skipped", className: "bg-slate-500/20 text-slate-500 border-slate-500/50" },
    rejected: { label: "Rejected", className: "bg-destructive/20 text-destructive border-destructive/50" },
  };

  const config = variants[status];

  return (
    <Badge variant="outline" className={cn("px-2 py-0.5 font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}