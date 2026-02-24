"use client";

import React, { useState } from 'react';
import { useQueue } from './QueueContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from './StatusBadge';
import { User, Ticket, Navigation, Clock, LogOut } from 'lucide-react';

export function UserDashboard() {
  const { currentUser, queue, joinQueue, logout } = useQueue();
  const [details, setDetails] = useState({ name: currentUser?.name || '', email: currentUser?.email || '' });

  const activeRequest = queue.items.find(i => i.userId === currentUser?.id && ['pending', 'approved', 'serving'].includes(i.status));

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    joinQueue(details);
  };

  if (!currentUser) return null;

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl animate-in-fade">
      <div className="flex justify-between items-start mb-12">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-xl font-bold">
            {currentUser.name[0]}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {currentUser.name}</h1>
            <p className="text-muted-foreground">{currentUser.email}</p>
          </div>
        </div>
        <Button variant="ghost" onClick={logout} className="text-muted-foreground">
          <LogOut className="h-4 w-4 mr-2" /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {!activeRequest ? (
          <Card className="glass border-none md:col-span-2">
            <CardHeader>
              <CardTitle className="text-3xl">Join the Queue</CardTitle>
              <CardDescription>Ready to be served? Join the line and we'll notify you when it's your turn.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleJoin} className="space-y-4 max-w-md mx-auto py-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Name</label>
                  <Input 
                    value={details.name} 
                    onChange={e => setDetails({ ...details, name: e.target.value })}
                    className="bg-white/5 border-white/10 h-12"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input 
                    type="email"
                    value={details.email} 
                    onChange={e => setDetails({ ...details, email: e.target.value })}
                    className="bg-white/5 border-white/10 h-12"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full h-12 bg-primary text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
                  Request Entry
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="glass border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4">
                <StatusBadge status={activeRequest.status} />
              </div>
              <CardHeader className="pt-12">
                <CardTitle className="text-center text-muted-foreground uppercase tracking-widest text-sm">Your Status</CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-12">
                {activeRequest.status === 'pending' ? (
                  <div className="space-y-4">
                    <div className="h-24 w-24 rounded-full border-4 border-amber-500/30 border-t-amber-500 animate-spin mx-auto" />
                    <p className="text-xl font-medium">Waiting for Approval</p>
                    <p className="text-sm text-muted-foreground">Admin will review your request shortly.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-6xl font-black text-primary drop-shadow-[0_0_15px_rgba(95,95,219,0.3)]">
                        #{activeRequest.tokenNumber}
                      </p>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Your Token</p>
                    </div>
                    {activeRequest.status === 'serving' ? (
                      <div className="bg-accent/10 p-4 rounded-xl border border-accent/20 animate-pulse-slow">
                        <p className="text-accent font-bold">IT'S YOUR TURN!</p>
                        <p className="text-xs text-accent/80">Please proceed to the counter immediately.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <Navigation className="h-4 w-4 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">{activeRequest.position}</p>
                          <p className="text-[10px] uppercase text-muted-foreground">Position</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                          <Clock className="h-4 w-4 mx-auto mb-2 text-primary" />
                          <p className="text-2xl font-bold">~{(activeRequest.position || 0) * 5}m</p>
                          <p className="text-[10px] uppercase text-muted-foreground">Wait Time</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass border-none">
              <CardHeader>
                <CardTitle>Queue Progress</CardTitle>
                <CardDescription>Live tracking of tokens being served.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5">
                  <div className="space-y-1">
                    <p className="text-xs uppercase text-muted-foreground">Now Serving</p>
                    <p className="text-4xl font-black text-accent">{queue.currentServingToken || "—"}</p>
                  </div>
                  <Ticket className="h-12 w-12 text-accent/20" />
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm font-medium">In line after you:</p>
                  <div className="flex gap-2 flex-wrap">
                    {queue.items
                      .filter(i => i.status === 'approved' && (i.tokenNumber || 0) > (activeRequest.tokenNumber || 0))
                      .map(i => (
                        <div key={i.id} className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-muted-foreground">
                          {i.tokenNumber}
                        </div>
                      ))}
                    {queue.items.filter(i => i.status === 'approved' && (i.tokenNumber || 0) > (activeRequest.tokenNumber || 0)).length === 0 && (
                      <p className="text-xs text-muted-foreground italic">You are last in line</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="text-center justify-center pt-0">
                <p className="text-[10px] text-muted-foreground">Updates automatically in real-time</p>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}