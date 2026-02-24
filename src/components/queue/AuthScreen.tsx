
"use client";

import React, { useState } from 'react';
import { useQueue } from './QueueContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { ShieldCheck, User as UserIcon, Waves, Monitor } from 'lucide-react';

export function AuthScreen() {
  const { login } = useQueue();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleAuth = (role: 'user' | 'admin') => {
    if (!formData.name || !formData.email) return;
    login(formData.name, formData.email, role);
  };

  return (
    <div className="min-h-svh flex items-center justify-center p-4 bg-[#17171C]">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary shadow-xl shadow-primary/20 mb-4 transform -rotate-6">
            <Waves className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white">SmartQueue</h1>
          <p className="text-muted-foreground">Revolutionizing the way you wait.</p>
        </div>

        <Card className="glass border-none shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Select your role to enter the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5">
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    className="bg-white/5 border-white/10" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="bg-white/5 border-white/10" 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <TabsContent value="user" className="mt-6">
                <Button className="w-full h-12 bg-primary hover:scale-[1.02] transition-all" onClick={() => handleAuth('user')}>
                  <UserIcon className="h-4 w-4 mr-2" /> Continue as User
                </Button>
              </TabsContent>

              <TabsContent value="admin" className="mt-6">
                <Button className="w-full h-12 bg-accent text-accent-foreground hover:scale-[1.02] transition-all" onClick={() => handleAuth('admin')}>
                  <ShieldCheck className="h-4 w-4 mr-2" /> Admin Portal Access
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs text-center">
            <Monitor className="h-4 w-4" />
            <span>Tip: Open two tabs to test Admin and User roles simultaneously.</span>
          </div>
          <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            Isolated session management enabled
          </p>
        </div>
      </div>
    </div>
  );
}
