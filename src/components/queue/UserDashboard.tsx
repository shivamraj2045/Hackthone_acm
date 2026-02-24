"use client";

import React, { useState } from 'react';
import { useQueue } from './QueueContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from './StatusBadge';
import { User, Ticket, Navigation, Clock, LogOut, Settings, History } from 'lucide-react';

export function UserDashboard() {
  const { currentUser, queue, joinQueue, logout, updateProfile } = useQueue();
  const [details, setDetails] = useState({ name: currentUser?.name || '', email: currentUser?.email || '' });
  const [profileData, setProfileData] = useState({ name: currentUser?.name || '', email: currentUser?.email || '' });

  const activeRequest = queue.items.find(i => i.userId === currentUser?.id && ['pending', 'approved', 'serving'].includes(i.status));
  const userHistory = queue.items.filter(i => i.userId === currentUser?.id && ['served', 'skipped', 'rejected'].includes(i.status));

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    joinQueue(details);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileData.name, profileData.email);
  };

  if (!currentUser) return null;

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl animate-in-fade">
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-2xl font-black shadow-lg shadow-primary/20 rotate-3">
            {currentUser.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {currentUser.name}</h1>
            <p className="text-muted-foreground text-sm">{currentUser.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={logout} className="text-muted-foreground border-white/5 hover:bg-white/5">
            <LogOut className="h-4 w-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>

      <Tabs defaultValue="queue" className="space-y-8">
        <TabsList className="glass border-none w-full max-w-md mx-auto grid grid-cols-2 p-1">
          <TabsTrigger value="queue">Live Queue</TabsTrigger>
          <TabsTrigger value="profile">Your Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-8 animate-in-fade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {!activeRequest ? (
              <Card className="glass border-none md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-3xl">Ready to join?</CardTitle>
                  <CardDescription>Enter your details below to request a spot in the live queue.</CardDescription>
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
                    <CardTitle className="text-center text-muted-foreground uppercase tracking-widest text-sm font-bold">Your Status</CardTitle>
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
                              <p className="text-[10px] uppercase text-muted-foreground font-bold">Position</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                              <Clock className="h-4 w-4 mx-auto mb-2 text-primary" />
                              <p className="text-2xl font-bold">~{(activeRequest.position || 0) * 5}m</p>
                              <p className="text-[10px] uppercase text-muted-foreground font-bold">Wait Time</p>
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
                        <p className="text-xs uppercase text-muted-foreground font-bold">Now Serving</p>
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
        </TabsContent>

        <TabsContent value="profile" className="animate-in-fade">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card className="glass border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" /> Account Settings
                  </CardTitle>
                  <CardDescription>Manage your profile information and how you appear in the queue.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <Input 
                        value={profileData.name} 
                        onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                        className="bg-white/5 border-white/10 h-11"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input 
                        type="email"
                        value={profileData.email} 
                        onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                        className="bg-white/5 border-white/10 h-11"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="pt-4">
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="glass border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" /> Queue History
                  </CardTitle>
                  <CardDescription>Your recently completed or cancelled visits.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userHistory.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic py-4">No past visits recorded.</p>
                    ) : (
                      userHistory.slice().reverse().map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 rounded-lg border border-white/5 bg-white/5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center font-bold text-primary">
                              #{item.tokenNumber || '—'}
                            </div>
                            <div>
                              <p className="text-sm font-medium">Service completed</p>
                              <p className="text-[10px] text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <StatusBadge status={item.status} />
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card className="glass border-none bg-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">Member Perks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs">Priority access notifications</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <History className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-xs">Visit history tracking</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-none">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Total Visits</span>
                    <span className="font-bold">{userHistory.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-emerald-400 font-bold">Active</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
