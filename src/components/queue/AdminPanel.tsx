"use client";

import React, { useState } from 'react';
import { useQueue } from './QueueContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from './StatusBadge';
import { AnalyticsCards } from './AnalyticsCards';
import { Input } from '@/components/ui/input';
import { Check, X, Play, FastForward, RotateCcw, Send, Settings, Activity, Users } from 'lucide-react';

export function AdminPanel() {
  const { queue, approveRequest, rejectRequest, callNext, skipToken, resetQueue, broadcastMessage } = useQueue();
  const [broadcast, setBroadcast] = useState("");

  const pendingRequests = queue.items.filter(i => i.status === 'pending');
  const activeQueue = queue.items.filter(i => i.status === 'approved' || i.status === 'serving').sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));

  const handleBroadcast = () => {
    if (!broadcast) return;
    broadcastMessage(broadcast);
    setBroadcast("");
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl animate-in-fade">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 gap-8">
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Activity className="h-8 w-8 text-primary animate-pulse" />
            <h1 className="text-5xl font-black tracking-tighter text-white neon-glow">COMMAND CENTER</h1>
          </div>
          <p className="text-muted-foreground text-lg font-medium tracking-wide">Orchestrating the perfect queue experience.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="lg" onClick={resetQueue} className="rounded-2xl text-destructive border-destructive/20 hover:bg-destructive hover:text-white transition-all h-14 px-8">
            <RotateCcw className="h-5 w-5 mr-2" /> FACTORY RESET
          </Button>
          <Button size="lg" onClick={callNext} className="rounded-2xl bg-accent text-black font-black hover:scale-105 transition-all h-14 px-8 funky-shadow shadow-accent/40">
            <Play className="h-5 w-5 mr-2 fill-black" /> NEXT IN LINE
          </Button>
        </div>
      </div>

      <AnalyticsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="glass border-none w-full justify-start p-2 mb-6 rounded-[2rem] h-16">
              <TabsTrigger value="requests" className="flex-1 rounded-2xl text-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-white">INCOMING ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="live" className="flex-1 rounded-2xl text-lg font-bold data-[state=active]:bg-accent data-[state=active]:text-black">LIVE GRID ({activeQueue.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests" className="animate-in-fade">
              <Card className="glass border-none rounded-[3rem] p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tight">
                    <Users className="h-6 w-6 text-primary" /> ENTRY PROTOCOLS
                  </CardTitle>
                  <CardDescription className="font-medium">Approve or deny access to the queue zone.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-white/10 border-b-2">
                        <TableHead className="font-black text-xs uppercase tracking-widest">SUBJECT</TableHead>
                        <TableHead className="font-black text-xs uppercase tracking-widest">EMAIL</TableHead>
                        <TableHead className="font-black text-xs uppercase tracking-widest">TIMESTAMP</TableHead>
                        <TableHead className="text-right font-black text-xs uppercase tracking-widest">ACTION</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRequests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-20 text-muted-foreground font-medium italic">All quiet in the waiting zone...</TableCell>
                        </TableRow>
                      ) : pendingRequests.map(item => (
                        <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors h-20">
                          <TableCell className="font-black text-lg tracking-tight">{item.userName}</TableCell>
                          <TableCell className="text-muted-foreground font-medium">{item.userName.toLowerCase()}@vibe.com</TableCell>
                          <TableCell className="text-xs text-muted-foreground font-bold">{new Date(item.createdAt).toLocaleTimeString()}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl text-destructive hover:bg-destructive/10" onClick={() => rejectRequest(item.id)}>
                                <X className="h-6 w-6" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-12 w-12 rounded-xl text-emerald-400 hover:bg-emerald-400/10" onClick={() => approveRequest(item.id)}>
                                <Check className="h-6 w-6" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="live" className="animate-in-fade">
              <Card className="glass border-none rounded-[3rem] p-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl font-black tracking-tight">
                    <Activity className="h-6 w-6 text-accent" /> ACTIVE FLOW
                  </CardTitle>
                  <CardDescription className="font-medium">Real-time status of everyone in the field.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-white/10 border-b-2">
                        <TableHead className="font-black text-xs uppercase tracking-widest">ID</TableHead>
                        <TableHead className="font-black text-xs uppercase tracking-widest">SUBJECT</TableHead>
                        <TableHead className="font-black text-xs uppercase tracking-widest">STATUS</TableHead>
                        <TableHead className="text-right font-black text-xs uppercase tracking-widest">ACTION</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeQueue.map(item => (
                        <TableRow key={item.id} className="border-white/5 hover:bg-white/5 h-20">
                          <TableCell className="font-black text-2xl text-primary tracking-tighter">#{item.tokenNumber}</TableCell>
                          <TableCell className="font-bold text-lg">{item.userName}</TableCell>
                          <TableCell><StatusBadge status={item.status} /></TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="rounded-xl h-10 px-4 text-muted-foreground hover:bg-white/10 font-bold" onClick={() => skipToken(item.id)}>
                              <FastForward className="h-4 w-4 mr-2" /> SKIP
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-10">
          <Card className="glass border-none rounded-[3rem] p-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8">
              <div className="h-3 w-3 rounded-full bg-accent animate-ping" />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-black tracking-tight">MEGA BROADCAST</CardTitle>
              <CardDescription className="font-medium">Blast a message to all active subjects.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <Input 
                placeholder="Type your message..." 
                className="bg-white/5 border-white/10 h-16 rounded-2xl text-lg px-6 focus:ring-primary/50" 
                value={broadcast}
                onChange={(e) => setBroadcast(e.target.value)}
              />
              <Button className="w-full h-16 bg-primary text-lg font-black rounded-2xl funky-shadow shadow-primary/30 hover:scale-[1.03] transition-transform" onClick={handleBroadcast}>
                <Send className="h-5 w-5 mr-3" /> TRANSMIT SIGNAL
              </Button>
            </CardContent>
          </Card>

          <Card className="glass border-none rounded-[3rem] p-8">
            <CardHeader>
              <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-2">
                <History className="h-6 w-6 text-muted-foreground" /> RECENTLY PROCESSED
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {queue.items.filter(i => i.status === 'served').slice(-6).reverse().map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center font-black text-emerald-400 border border-white/10">
                        #{item.tokenNumber}
                      </div>
                      <span className="font-bold text-lg tracking-tight">{item.userName}</span>
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-muted-foreground uppercase bg-white/5 px-2 py-1 rounded-md">PROCESSED</span>
                  </div>
                ))}
                {queue.items.filter(i => i.status === 'served').length === 0 && (
                  <p className="text-center py-8 text-muted-foreground font-medium italic">No mission data recorded yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
