
"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { QueueItem, QueueState, User, QueueStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  writeBatch,
  getDoc
} from 'firebase/firestore';
import { useFirestore } from '@/firebase';

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

const USER_SESSION_KEY = 'smart_queue_user_session_v2';

export const QueueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const db = useFirestore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [items, setItems] = useState<QueueItem[]>([]);
  const [metadata, setMetadata] = useState<{ lastTokenNumber: number; currentServingToken: number | null }>({
    lastTokenNumber: 0,
    currentServingToken: null
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Load User Session
  useEffect(() => {
    const savedUser = sessionStorage.getItem(USER_SESSION_KEY);
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Sync Queue Items from Firestore
  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, 'queue'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as QueueItem[];
      setItems(newItems);
    });

    return () => unsubscribe();
  }, [db]);

  // Sync Metadata from Firestore
  useEffect(() => {
    if (!db) return;

    const unsubscribe = onSnapshot(doc(db, 'metadata', 'config'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setMetadata({
          lastTokenNumber: data.lastTokenNumber || 0,
          currentServingToken: data.currentServingToken || null
        });
      }
    });

    return () => unsubscribe();
  }, [db]);

  const queue: QueueState = useMemo(() => ({
    items,
    currentServingToken: metadata.currentServingToken,
    lastTokenNumber: metadata.lastTokenNumber
  }), [items, metadata]);

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
    setCurrentUser({ ...currentUser, name, email });
    toast({ title: "Profile Updated", description: "Your changes have been saved." });
  };

  const joinQueue = async (details: { name: string; email: string }) => {
    if (!currentUser || !db) return;
    
    const exists = items.find(item => item.userId === currentUser.id && ['pending', 'approved', 'serving'].includes(item.status));
    if (exists) {
      toast({ title: "Already in queue", description: "You have an active queue request.", variant: "destructive" });
      return;
    }

    const itemId = Math.random().toString(36).substring(2, 11);
    const newItem: Omit<QueueItem, 'id'> = {
      userId: currentUser.id,
      userName: details.name,
      tokenNumber: null,
      status: 'pending',
      position: null,
      createdAt: new Date().toISOString(),
    };

    setDoc(doc(db, 'queue', itemId), newItem);
    toast({ title: "Request Sent", description: "Waiting for admin approval." });
  };

  const approveRequest = async (itemId: string) => {
    if (!db) return;
    const newToken = metadata.lastTokenNumber + 1;
    const approvedItemsCount = items.filter(i => i.status === 'approved' || i.status === 'serving').length;
    
    const batch = writeBatch(db);
    batch.update(doc(db, 'queue', itemId), {
      status: 'approved',
      tokenNumber: newToken,
      position: approvedItemsCount + 1
    });
    batch.set(doc(db, 'metadata', 'config'), { 
      ...metadata, 
      lastTokenNumber: newToken 
    }, { merge: true });

    await batch.commit();
    toast({ title: "Approved", description: "User has been added to the queue." });
  };

  const rejectRequest = (itemId: string) => {
    if (!db) return;
    updateDoc(doc(db, 'queue', itemId), { status: 'rejected' });
  };

  const callNext = async () => {
    if (!db) return;
    const approvedItems = items
      .filter(i => i.status === 'approved')
      .sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));

    if (approvedItems.length === 0) {
      toast({ title: "Queue Empty", description: "No pending approved tokens.", variant: "destructive" });
      return;
    }

    const nextItem = approvedItems[0];
    const batch = writeBatch(db);

    // Set next item to serving
    batch.update(doc(db, 'queue', nextItem.id), { status: 'serving', position: 0 });

    // Set currently serving to served
    const currentlyServing = items.find(i => i.status === 'serving');
    if (currentlyServing) {
      batch.update(doc(db, 'queue', currentlyServing.id), { 
        status: 'served', 
        position: null, 
        servedAt: new Date().toISOString() 
      });
    }

    // Update others' positions
    items.filter(i => i.status === 'approved' && i.id !== nextItem.id).forEach(item => {
      batch.update(doc(db, 'queue', item.id), { position: Math.max(0, (item.position || 1) - 1) });
    });

    batch.set(doc(db, 'metadata', 'config'), { 
      ...metadata, 
      currentServingToken: nextItem.tokenNumber 
    }, { merge: true });

    await batch.commit();
    toast({ title: "Calling Next", description: `Token #${nextItem.tokenNumber} called.` });
  };

  const skipToken = (itemId: string) => {
    if (!db) return;
    updateDoc(doc(db, 'queue', itemId), { status: 'skipped', position: null });
  };

  const resetQueue = async () => {
    if (!db) return;
    const batch = writeBatch(db);
    items.forEach(item => batch.delete(doc(db, 'queue', item.id)));
    batch.set(doc(db, 'metadata', 'config'), { lastTokenNumber: 0, currentServingToken: null });
    await batch.commit();
    toast({ title: "Queue Reset", description: "All data cleared." });
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
