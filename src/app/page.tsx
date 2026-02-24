
"use client";

import { QueueProvider, useQueue } from "@/components/queue/QueueContext";
import { AuthScreen } from "@/components/queue/AuthScreen";
import { AdminPanel } from "@/components/queue/AdminPanel";
import { UserDashboard } from "@/components/queue/UserDashboard";
import { Loader2 } from "lucide-react";

function AppContent() {
  const { currentUser, isInitialized } = useQueue();

  // Prevent UI flash while loading session from sessionStorage
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#17171C]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen />;
  }

  return (
    <main className="min-h-screen">
      {currentUser.role === 'admin' ? (
        <AdminPanel />
      ) : (
        <UserDashboard />
      )}
    </main>
  );
}

export default function Home() {
  return (
    <QueueProvider>
      <AppContent />
    </QueueProvider>
  );
}
