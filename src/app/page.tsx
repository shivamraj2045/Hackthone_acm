"use client";

import { QueueProvider, useQueue } from "@/components/queue/QueueContext";
import { AuthScreen } from "@/components/queue/AuthScreen";
import { AdminPanel } from "@/components/queue/AdminPanel";
import { UserDashboard } from "@/components/queue/UserDashboard";

function AppContent() {
  const { currentUser } = useQueue();

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