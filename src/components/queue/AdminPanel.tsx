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
import { Check, X, Play, FastForward, RotateCcw, Send } from 'lucide-react';

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
    <div className="container mx-auto py-8 px-4 animate-in-fade">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage incoming requests and control the live queue.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetQueue} className="text-destructive border-destructive/30 hover:bg-destructive/10">
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button size="sm" onClick={callNext} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Play className="h-4 w-4 mr-2" /> Call Next
          </Button>
        </div>
      </div>

      <AnalyticsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="requests" className="w-full">
            <TabsList className="glass border-none w-full justify-start p-1 mb-4">
              <TabsTrigger value="requests" className="flex-1">Pending Requests ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="live" className="flex-1">Live Queue ({activeQueue.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="requests">
              <Card className="glass border-none">
                <CardHeader>
                  <CardTitle>Entry Requests</CardTitle>
                  <CardDescription>Approve users to assign them a token number.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-white/5">
                        <TableHead>User Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRequests.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No pending requests</TableCell>
                        </TableRow>
                      ) : pendingRequests.map(item => (
                        <TableRow key={item.id} className="border-white/5 hover:bg-white/5">
                          <TableCell className="font-medium">{item.userName}</TableCell>
                          <TableCell className="text-muted-foreground">{item.userName.toLowerCase()}@example.com</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleTimeString()}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => rejectRequest(item.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-500" onClick={() => approveRequest(item.id)}>
                              <Check className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="live">
              <Card className="glass border-none">
                <CardHeader>
                  <CardTitle>Queue Management</CardTitle>
                  <CardDescription>View and skip users currently in line.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-white/5">
                        <TableHead>Token</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {activeQueue.map(item => (
                        <TableRow key={item.id} className="border-white/5 hover:bg-white/5">
                          <TableCell className="font-bold text-primary">#{item.tokenNumber}</TableCell>
                          <TableCell>{item.userName}</TableCell>
                          <TableCell><StatusBadge status={item.status} /></TableCell>
                          <TableCell className="text-right">
                            <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => skipToken(item.id)}>
                              <FastForward className="h-4 w-4 mr-1" /> Skip
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

        <div className="space-y-8">
          <Card className="glass border-none">
            <CardHeader>
              <CardTitle>Quick Announcement</CardTitle>
              <CardDescription>Broadcast a message to everyone in the queue.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input 
                placeholder="Enter message..." 
                className="bg-white/5 border-white/10" 
                value={broadcast}
                onChange={(e) => setBroadcast(e.target.value)}
              />
              <Button className="w-full bg-primary" onClick={handleBroadcast}>
                <Send className="h-4 w-4 mr-2" /> Send Broadcast
              </Button>
            </CardContent>
          </Card>

          <Card className="glass border-none">
            <CardHeader>
              <CardTitle>Recently Served</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {queue.items.filter(i => i.status === 'served').slice(-5).reverse().map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
                    <span>Token #{item.tokenNumber}</span>
                    <span className="text-muted-foreground">{item.userName}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}