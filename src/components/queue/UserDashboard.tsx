"use client";

import React, { useState } from 'react';
import { useQueue } from './QueueContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from './StatusBadge';
import { Ticket, Navigation, Clock, LogOut, Settings, History, Rocket, Crown, Flame } from 'lucide-react';

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
    <div className="container mx-auto py-12 px-4 max-w-5xl animate-in-fade">
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-12 gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
            <div className="relative h-20 w-20 rounded-[1.5rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-black text-white shadow-xl rotate-3 hover:rotate-0 transition-transform cursor-default">
              {currentUser.name[0].toUpperCase()}
            </div>
            <Crown className="absolute -top-3 -right-3 h-8 w-8 text-yellow-400 fill-yellow-400 -rotate-12 animate-float" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black tracking-tighter neon-glow">Hey, {currentUser.name}!</h1>
            <div className="flex items-center gap-2 mt-1 justify-center md:justify-start">
              <span className="text-accent font-bold text-sm px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20 flex items-center gap-1">
                <Flame className="h-3 w-3 fill-accent" /> VIP STATUS
              </span>
              <p className="text-muted-foreground text-sm font-medium">{currentUser.email}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={logout} className="rounded-2xl border-white/10 bg-white/5 hover:bg-destructive hover:text-white transition-all group">
            <LogOut className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Exit
          </Button>
        </div>
      </div>

      <Tabs defaultValue="queue" className="space-y-10">
        <TabsList className="glass border-none w-full max-w-lg mx-auto grid grid-cols-2 p-1.5 rounded-[2rem] h-16">
          <TabsTrigger value="queue" className="rounded-[1.5rem] text-lg font-bold data-[state=active]:bg-primary data-[state=active]:text-white">Live Vibes</TabsTrigger>
          <TabsTrigger value="profile" className="rounded-[1.5rem] text-lg font-bold data-[state=active]:bg-accent data-[state=active]:text-black">My Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-8 animate-in-fade">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {!activeRequest ? (
              <Card className="glass border-none md:col-span-2 p-12 rounded-[3rem] text-center overflow-hidden relative group">
                <div className="absolute top-[-20%] right-[-10%] w-[30%] h-[50%] bg-primary/20 blur-[100px] group-hover:bg-primary/30 transition-all" />
                <CardHeader>
                  <CardTitle className="text-5xl font-black tracking-tighter mb-4">Want a spot?</CardTitle>
                  <CardDescription className="text-xl font-medium max-w-xl mx-auto">Drop your details and we'll slide you into the digital line. It's that easy.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleJoin} className="space-y-6 max-w-md mx-auto py-10 relative z-10">
                    <div className="space-y-3">
                      <Input 
                        value={details.name} 
                        onChange={e => setDetails({ ...details, name: e.target.value })}
                        className="bg-white/5 border-white/10 h-16 rounded-2xl text-xl px-8 focus:ring-primary/50"
                        placeholder="Your Vibe Name"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Input 
                        type="email"
                        value={details.email} 
                        onChange={e => setDetails({ ...details, email: e.target.value })}
                        className="bg-white/5 border-white/10 h-16 rounded-2xl text-xl px-8 focus:ring-primary/50"
                        placeholder="Digital Mailbox"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full h-20 bg-primary text-2xl font-black rounded-3xl funky-shadow hover:scale-[1.05] active:scale-95 transition-all">
                      <Rocket className="h-6 w-6 mr-3" /> JOIN THE SQUAD
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="glass border-none overflow-hidden relative rounded-[3rem] p-8">
                  <div className="absolute top-6 right-8">
                    <StatusBadge status={activeRequest.status} />
                  </div>
                  <CardHeader className="pt-16 pb-8 text-center">
                    <CardTitle className="text-muted-foreground uppercase tracking-[0.3em] text-xs font-black">YOUR CURRENT VIBE</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pb-12">
                    {activeRequest.status === 'pending' ? (
                      <div className="space-y-8">
                        <div className="relative inline-block">
                          <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20" />
                          <div className="h-32 w-32 rounded-full border-[6px] border-amber-500/20 border-t-amber-500 animate-spin mx-auto relative" />
                        </div>
                        <div className="space-y-2">
                          <p className="text-3xl font-black tracking-tight">VIBE CHECKING...</p>
                          <p className="text-muted-foreground font-medium">Hang tight, the admin is reviewing your entry.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-10">
                        <div className="relative inline-block group">
                          <div className="absolute inset-0 bg-primary blur-[60px] opacity-40 group-hover:opacity-70 transition-opacity" />
                          <p className="text-[10rem] leading-none font-black text-white relative neon-glow tracking-tighter">
                            {activeRequest.tokenNumber}
                          </p>
                          <p className="text-sm uppercase tracking-[0.5em] text-primary font-black mt-2">TOKEN ID</p>
                        </div>
                        
                        {activeRequest.status === 'serving' ? (
                          <div className="bg-accent text-black p-8 rounded-[2.5rem] animate-pulse-slow shadow-2xl shadow-accent/40 scale-110 relative z-20">
                            <p className="text-2xl font-black tracking-tighter">YO! IT'S YOUR TURN!</p>
                            <p className="text-sm font-bold opacity-80 uppercase tracking-widest mt-1">Slide to the counter now</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-6 pt-4">
                            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-colors">
                              <Navigation className="h-6 w-6 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                              <p className="text-4xl font-black tracking-tighter">{activeRequest.position}</p>
                              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black mt-1">SQUAD RANK</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 group hover:bg-white/10 transition-colors">
                              <Clock className="h-6 w-6 mx-auto mb-3 text-accent group-hover:scale-110 transition-transform" />
                              <p className="text-4xl font-black tracking-tighter">{(activeRequest.position || 0) * 5}<span className="text-xl">m</span></p>
                              <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black mt-1">VIBE WAIT</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="glass border-none rounded-[3rem] p-8 overflow-hidden relative">
                  <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[80px]" />
                  <CardHeader>
                    <CardTitle className="text-2xl font-black tracking-tight">GLOBAL RADAR</CardTitle>
                    <CardDescription className="font-medium">See who's vibing in the zone right now.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 relative z-10">
                    <div className="flex justify-between items-center bg-gradient-to-r from-accent/20 to-primary/10 p-8 rounded-[2.5rem] border border-white/5">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-black">NOW SERVING</p>
                        <p className="text-6xl font-black text-accent neon-glow">#{queue.currentServingToken || "0"}</p>
                      </div>
                      <div className="h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center animate-bounce-slow">
                        <Ticket className="h-8 w-8 text-accent fill-accent/20" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">THE SQUAD BEHIND YOU:</p>
                      <div className="flex gap-3 flex-wrap">
                        {queue.items
                          .filter(i => i.status === 'approved' && (i.tokenNumber || 0) > (activeRequest.tokenNumber || 0))
                          .slice(0, 10)
                          .map(i => (
                            <div key={i.id} className="h-12 w-12 rounded-[1rem] bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all cursor-default">
                              {i.tokenNumber}
                            </div>
                          ))}
                        {queue.items.filter(i => i.status === 'approved' && (i.tokenNumber || 0) > (activeRequest.tokenNumber || 0)).length === 0 && (
                          <div className="w-full p-4 rounded-2xl bg-white/5 border border-dashed border-white/10 text-center">
                            <p className="text-xs text-muted-foreground font-medium italic">You're at the end of the line. Enjoy the view!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="text-center justify-center pt-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                      <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase">LIVE SYNC ACTIVE</p>
                    </div>
                  </CardFooter>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile" className="animate-in-fade space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card className="glass border-none rounded-[3rem] p-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-3xl font-black tracking-tighter">
                    <Settings className="h-8 w-8 text-primary" /> VIBE SETTINGS
                  </CardTitle>
                  <CardDescription className="text-lg font-medium">Customize your presence in the digital realm.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6 py-4">
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">YOUR HANDLE</label>
                      <Input 
                        value={profileData.name} 
                        onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                        className="bg-white/5 border-white/10 h-16 rounded-2xl text-lg px-6 focus:ring-primary/50"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">COMMUNICATION FREQUENCY</label>
                      <Input 
                        type="email"
                        value={profileData.email} 
                        onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                        className="bg-white/5 border-white/10 h-16 rounded-2xl text-lg px-6 focus:ring-primary/50"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="pt-6">
                      <Button type="submit" className="h-16 px-12 bg-primary text-lg font-black rounded-2xl funky-shadow hover:scale-105 transition-transform">
                        SAVE THE VIBE
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="glass border-none rounded-[3rem] p-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-3xl font-black tracking-tighter">
                    <History className="h-8 w-8 text-accent" /> LEGACY TRACKS
                  </CardTitle>
                  <CardDescription className="text-lg font-medium">Your historical queue entries and completed missions.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userHistory.length === 0 ? (
                      <div className="py-12 text-center bg-white/5 rounded-[2rem] border border-dashed border-white/10">
                        <p className="text-muted-foreground font-medium">Your history is currently a blank canvas.</p>
                      </div>
                    ) : (
                      userHistory.slice().reverse().map(item => (
                        <div key={item.id} className="flex justify-between items-center p-6 rounded-[1.5rem] border border-white/5 bg-white/5 hover:bg-white/10 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center font-black text-2xl text-primary border border-white/10">
                              #{item.tokenNumber || '—'}
                            </div>
                            <div>
                              <p className="text-lg font-black tracking-tight uppercase">MISSION COMPLETED</p>
                              <p className="text-xs text-muted-foreground font-bold tracking-widest">{new Date(item.createdAt).toLocaleDateString()}</p>
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
              <Card className="glass border-none bg-gradient-to-br from-primary/20 to-accent/10 rounded-[3rem] p-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-black tracking-tighter">ELITE PERKS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-[1rem] bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Rocket className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-bold tracking-tight">Sonic Notifications</p>
                  </div>
                  <div className="flex items-center gap-4 group">
                    <div className="h-12 w-12 rounded-[1rem] bg-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Flame className="h-6 w-6 text-accent" />
                    </div>
                    <p className="text-sm font-bold tracking-tight">Priority Status Tracking</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-none rounded-[3rem] p-8">
                <CardHeader>
                  <CardTitle className="text-2xl font-black tracking-tighter">THE STATS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-end border-b border-white/5 pb-4">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">VISITS</span>
                    <span className="text-4xl font-black tracking-tighter text-primary">{userHistory.length}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">STATUS</span>
                    <span className="text-2xl font-black tracking-tighter text-emerald-400">ACTIVATED</span>
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
