"use client";

import { useQueue } from "./QueueContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Play, Clock, CheckCircle } from "lucide-react";

export function AnalyticsCards() {
  const { queue } = useQueue();
  
  const waiting = queue.items.filter(i => i.status === 'approved').length;
  const servedToday = queue.items.filter(i => i.status === 'served').length;
  
  const averageWait = servedToday > 0 ? "12 min" : "N/A";

  const stats = [
    { title: "Waiting Users", value: waiting, icon: Users, color: "text-primary" },
    { title: "Serving Token", value: queue.currentServingToken || "—", icon: Play, color: "text-accent" },
    { title: "Avg. Wait Time", value: averageWait, icon: Clock, color: "text-amber-400" },
    { title: "Total Served", value: servedToday, icon: CheckCircle, color: "text-emerald-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <Card key={stat.title} className="glass border-none">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}