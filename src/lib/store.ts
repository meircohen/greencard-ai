import { create } from "zustand";
import { persist } from "zustand/middleware";

// Auth Store Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "client" | "attorney" | "admin";  // Must match DB enum
  avatar?: string;
  phone?: string;
  timezone?: string;
  language?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

// Case Store Types
export interface CaseFile {
  id: string;
  userId: string;
  title: string;
  visaType: string;
  status: "draft" | "in_progress" | "completed" | "approved";
  createdAt: Date;
  updatedAt: Date;
  description?: string;
  attorney?: string;
}

interface CaseStore {
  cases: CaseFile[];
  activeCase: CaseFile | null;
  addCase: (caseFile: CaseFile) => void;
  updateCase: (id: string, updates: Partial<CaseFile>) => void;
  deleteCase: (id: string) => void;
  setActiveCase: (caseFile: CaseFile | null) => void;
}

// Notification Store Types
export interface Notification {
  id: string;
  type: "case_update" | "deadline" | "document" | "billing" | "system";
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
}

// Chat Store Types
export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatStore {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  addMessage: (message: Message) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  clearMessages: () => void;
}

// UI Store Types
interface UIStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  chatMode: "live" | "demo";
  setChatMode: (mode: "live" | "demo") => void;
  isModalOpen: boolean;
  setModalOpen: (open: boolean) => void;
}

// Auth Store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user: User) =>
        set({
          user,
          isAuthenticated: true,
        }),
      logout: async () => {
        try {
          // Call the logout API
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
        } catch (error) {
          console.error("Logout API call failed:", error);
        } finally {
          // Clear state regardless of API success
          set({
            user: null,
            isAuthenticated: false,
          });
          // Redirect to login page
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      },
      updateProfile: (updates: Partial<User>) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      // Handle SSR safely
      storage: {
        getItem: (name) => {
          if (typeof window === "undefined") return null;
          const item = window.localStorage.getItem(name);
          return item ? JSON.parse(item) : null;
        },
        setItem: (name, value) => {
          if (typeof window !== "undefined") {
            window.localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== "undefined") {
            window.localStorage.removeItem(name);
          }
        },
      },
    }
  )
);

// Case Store
export const useCaseStore = create<CaseStore>((set) => ({
  cases: [],
  activeCase: null,
  addCase: (caseFile: CaseFile) =>
    set((state) => ({
      cases: [...state.cases, caseFile],
    })),
  updateCase: (id: string, updates: Partial<CaseFile>) =>
    set((state) => ({
      cases: state.cases.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      activeCase: state.activeCase?.id === id ? { ...state.activeCase, ...updates } : state.activeCase,
    })),
  deleteCase: (id: string) =>
    set((state) => ({
      cases: state.cases.filter((c) => c.id !== id),
      activeCase: state.activeCase?.id === id ? null : state.activeCase,
    })),
  setActiveCase: (caseFile: CaseFile | null) =>
    set({
      activeCase: caseFile,
    }),
}));

// Notification Store
export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  addNotification: (notification) =>
    set((state) => {
      const newNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date(),
        read: false,
        ...notification,
      };
      return {
        notifications: [newNotification, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }),
  markRead: (id: string) =>
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: notification && !notification.read ? state.unreadCount - 1 : state.unreadCount,
      };
    }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  clearAll: () =>
    set({
      notifications: [],
      unreadCount: 0,
    }),
}));

// Chat Store
export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  addMessage: (message: Message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  setActiveConversation: (conversation: Conversation | null) =>
    set({
      activeConversation: conversation,
    }),
  clearMessages: () =>
    set({
      messages: [],
    }),
}));

// UI Store
export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open: boolean) =>
    set({
      sidebarOpen: open,
    }),
  theme: "dark",
  setTheme: (theme: "dark" | "light") =>
    set({
      theme,
    }),
  chatMode: "demo",
  setChatMode: (mode: "live" | "demo") =>
    set({
      chatMode: mode,
    }),
  isModalOpen: false,
  setModalOpen: (open: boolean) =>
    set({
      isModalOpen: open,
    }),
}));
