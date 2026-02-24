"use client";

import { useQueue } from "./QueueContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Play, Clock, CheckCircle, Zap } from "lucide-react";

export function AnalyticsCards() {
  const { queue } = useQueue();
  
  const waiting = queue.items.filter(i => i.status === 'approved').length;
  const servedToday = queue.items.filter(i => i.status === 'served').length;
  
  const averageWait = servedToday > 0 ? "12 min" : "N/A";

  const stats = [
    { title: "WAITING LINE", value: waiting, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { title: "CURRENT TOKEN", value: queue.currentServingToken || "NONE", icon: Play, color: "text-accent", bg: "bg-accent/10" },
    { title: "AVG VIBE WAIT", value: averageWait, icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
    { title: "MISSIONS COMPLETE", value: servedToday, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat) => (
        <Card key={stat.title} className="glass border-none rounded-[2.5rem] hover:scale-105 transition-all cursor-default group overflow-hidden">
          <div className={`absolute inset-0 ${stat.bg} opacity-0 group-hover:opacity-100 transition-opacity`} />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} group-hover:rotate-12 transition-transform`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-4">
            <div className={`text-4xl font-black tracking-tighter ${stat.color} neon-glow`}>
              {stat.value}
            </div>
          </CardContent>
          <div className="absolute bottom-[-15px] right-[-15px] opacity-10 group-hover:opacity-20 transition-opacity">
            <stat.icon className="h-24 w-24 rotate-12" />
          </div>
        </Card>
      ))}
    </div>
  );
}
