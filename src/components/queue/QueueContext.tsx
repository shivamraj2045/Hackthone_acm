"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { QueueItem, QueueState, User, QueueStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface QueueContextType {
  queue: QueueState;
  currentUser: User | null;
  isInitialized: boolean;
  login: (name: string, email: string, role: 'user' | 'admin') => void;
  logout: () => void;
  updateProfile: (name: string, email: string) => void;
  joinQueue: (details: { name: string; email: string }) => void;
  approveRequest: (itemId: string) => void;
  rejectRequest: (itemId: string) => void;
  callNext: () => void;
  skipToken: (itemId: string) => void;
  resetQueue: () => void;
  broadcastMessage: (msg: string) => void;
}

const QueueContext = createContext<QueueContextType | undefined>(undefined);

const STORAGE_KEY = 'smart_queue_data_v1';
const USER_SESSION_KEY = 'smart_queue_user_session_v1';

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);
  const [queue, setQueue] = useState<QueueState>({
    items: [],
    currentServingToken: null,
    lastTokenNumber: 0,
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Initial Load: Queue from localStorage (shared), User from sessionStorage (isolated per tab)
  useEffect(() => {
    const savedQueue = localStorage.getItem(STORAGE_KEY);
    const savedUser = sessionStorage.getItem(USER_SESSION_KEY);
    
    if (savedQueue) {
      try {
        setQueue(JSON.parse(savedQueue));
      } catch (e) {
        console.error("Failed to parse queue data", e);
      }
    }
    
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
    
    setIsInitialized(true);
  }, []);

  // Real-time Sync across tabs for Shared Queue Data
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updatedQueue = JSON.parse(e.newValue);
          setQueue(updatedQueue);
        } catch (err) {
          // Ignore parse errors from external changes
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Persist Queue Changes to localStorage (shared)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
    }
  }, [queue, isInitialized]);

  // Persist User Session to sessionStorage (isolated per tab)
  useEffect(() => {
    if (isInitialized) {
      if (currentUser) {
        sessionStorage.setItem(USER_SESSION_KEY, JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem(USER_SESSION_KEY);
      }
    }
  }, [currentUser, isInitialized]);

  const login = (name: string, email: string, role: 'user' | 'admin') => {
    const newUser: User = { 
      id: Math.random().toString(36).substring(2, 11), 
      name, 
      email, 
      role 
    };
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (name: string, email: string) => {
    if (!currentUser) return;
    setCurrentUser({
      ...currentUser,
      name,
      email
    });
    toast({ title: "Profile Updated", description: "Your changes have been saved." });
  };

  const joinQueue = (details: { name: string; email: string }) => {
    if (!currentUser) return;
    
    const exists = queue.items.find(item => item.userId === currentUser.id && ['pending', 'approved', 'serving'].includes(item.status));
    if (exists) {
      toast({ title: "Already in queue", description: "You have an active queue request.", variant: "destructive" });
      return;
    }

    const newItem: QueueItem = {
      id: Math.random().toString(36).substring(2, 11),
      userId: currentUser.id,
      userName: details.name,
      tokenNumber: null,
      status: 'pending',
      position: null,
      createdAt: new Date().toISOString(),
    };

    setQueue(prev => ({ ...prev, items: [...prev.items, newItem] }));
    toast({ title: "Request Sent", description: "Waiting for admin approval." });
  };

  const approveRequest = (itemId: string) => {
    setQueue(prev => {
      const newToken = prev.lastTokenNumber + 1;
      const approvedItems = prev.items.filter(i => i.status === 'approved' || i.status === 'serving').length;
      
      const newItems = prev.items.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            status: 'approved' as QueueStatus,
            tokenNumber: newToken,
            position: approvedItems + 1
          };
        }
        return item;
      });

      return {
        ...prev,
        items: newItems,
        lastTokenNumber: newToken
      };
    });
    toast({ title: "Approved", description: "User has been added to the queue." });
  };

  const rejectRequest = (itemId: string) => {
    setQueue(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === itemId ? { ...i, status: 'rejected' } : i)
    }));
  };

  const callNext = () => {
    setQueue(prev => {
      const approvedItems = prev.items.filter(i => i.status === 'approved').sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));
      if (approvedItems.length === 0) {
        toast({ title: "Queue Empty", description: "No pending approved tokens to call.", variant: "destructive" });
        return prev;
      }

      const nextItem = approvedItems[0];
      const newItems = prev.items.map(item => {
        if (item.id === nextItem.id) return { ...item, status: 'serving' as QueueStatus, position: 0 };
        if (item.status === 'serving') return { ...item, status: 'served' as QueueStatus, position: null, servedAt: new Date().toISOString() };
        if (item.status === 'approved') return { ...item, position: Math.max(0, (item.position || 1) - 1) };
        return item;
      });

      return {
        ...prev,
        items: newItems,
        currentServingToken: nextItem.tokenNumber
      };
    });
    toast({ title: "Calling Next", description: "The next token has been alerted." });
  };

  const skipToken = (itemId: string) => {
    setQueue(prev => ({
      ...prev,
      items: prev.items.map(i => i.id === itemId ? { ...i, status: 'skipped' as QueueStatus, position: null } : i)
    }));
  };

  const resetQueue = () => {
    setQueue({
      items: [],
      currentServingToken: null,
      lastTokenNumber: 0
    });
    toast({ title: "Queue Reset", description: "All queue data has been cleared." });
  };

  const broadcastMessage = (msg: string) => {
    toast({ title: "Announcement", description: msg });
  };

  return (
    <QueueContext.Provider value={{
      queue, currentUser, isInitialized, login, logout, updateProfile, joinQueue,
      approveRequest, rejectRequest, callNext, skipToken, resetQueue, broadcastMessage
    }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) throw new Error('useQueue must be used within QueueProvider');
  return context;
};
