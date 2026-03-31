import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SessionResponse {
  session: Session | null;
  user: User | null;
  setSession: (sessionData: SessionResponse) => void;
  clearSession: () => void;
}

export interface Session {
  id: string;
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export const useSessionStore = create<SessionResponse>()(
  persist(
    (set) => ({
      session: null,
      user: null,
      setSession: (sessionData: SessionResponse) => set({ ...sessionData }),
      clearSession: () =>
        set({
          session: null,
          user: null,
        }),
    }),
    {
      name: "buyer-auth",
      partialize: (state) => ({
        session: state.session,
        user: state.user,
      }),
    },
  ),
);
