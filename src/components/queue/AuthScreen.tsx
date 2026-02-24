"use client";

import React, { useState } from 'react';
import { useQueue } from './QueueContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ShieldCheck, User as UserIcon, Zap, Sparkles, Orbit } from 'lucide-react';

export function AuthScreen() {
  const { login } = useQueue();
  const [formData, setFormData] = useState({ name: '', email: '' });

  const handleAuth = (role: 'user' | 'admin') => {
    if (!formData.name || !formData.email) return;
    login(formData.name, formData.email, role);
  };

  return (
    <div className="min-h-svh flex items-center justify-center p-4 relative overflow-hidden bg-[#0A0A0F]">
      {/* Decorative funky elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px] animate-pulse-slow" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="relative inline-block animate-float">
            <div className="absolute inset-0 bg-primary blur-2xl opacity-40 rounded-full" />
            <div className="relative h-20 w-20 rounded-[2rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-2xl transform hover:rotate-12 transition-transform cursor-pointer">
              <Zap className="h-10 w-10 text-white fill-white" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-accent animate-pulse" />
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-white neon-glow">
              SMART<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">QUEUE</span>
            </h1>
            <p className="text-muted-foreground font-medium tracking-wide">THE FUTURE OF WAITING IS HERE.</p>
          </div>
        </div>

        <Card className="glass border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-[gradient_4s_linear_infinite]" />
          <CardHeader className="pb-4 pt-8 text-center">
            <CardTitle className="text-2xl font-bold">Who are you today?</CardTitle>
            <CardDescription>Enter the zone and get your spot.</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-10">
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/5 p-1 rounded-2xl h-12">
                <TabsTrigger value="user" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">User</TabsTrigger>
                <TabsTrigger value="admin" className="rounded-xl data-[state=active]:bg-accent data-[state=active]:text-black">Admin</TabsTrigger>
              </TabsList>

              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Identity</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your cool name" 
                    className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/50 text-lg px-6" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Digital Mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="you@vibe.com" 
                    className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-primary/50 text-lg px-6" 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <TabsContent value="user" className="mt-8">
                <Button className="w-full h-16 bg-primary text-white text-lg font-black rounded-2xl funky-shadow hover:scale-[1.03] active:scale-95 transition-all shadow-primary/20" onClick={() => handleAuth('user')}>
                  <UserIcon className="h-5 w-5 mr-2" /> JUMP IN LINE
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="mt-8">
                <Button className="w-full h-16 bg-accent text-black text-lg font-black rounded-2xl funky-shadow hover:scale-[1.03] active:scale-95 transition-all shadow-accent/20" onClick={() => handleAuth('admin')}>
                  <ShieldCheck className="h-5 w-5 mr-2" /> CONTROL CENTER
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-3 py-4 px-6 rounded-[2rem] bg-white/5 border border-white/10">
          <Orbit className="h-5 w-5 text-accent animate-spin-slow" />
          <span className="text-sm text-muted-foreground font-medium">Pro tip: Open multiple tabs to see the magic sync.</span>
        </div>
      </div>
    </div>
  );
}
