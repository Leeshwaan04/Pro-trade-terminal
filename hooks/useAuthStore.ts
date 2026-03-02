"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ─── Types ───────────────────────────────────────────────────
export interface KiteUser {
    user_id: string;
    user_name: string;
    user_shortname: string;
    email: string;
    broker: string;
    exchanges: string[];
    products: string[];
    order_types: string[];
    avatar_url?: string;
    login_time: string;
}

export interface GrowwUser {
    user_id: string;
    user_name: string;
    email: string;
    broker: "GROWW";
}

type UnifiedUser = KiteUser | GrowwUser;

interface AuthState {
    // ─── Session ─────────────────────────────────────────────
    isLoggedIn: boolean;
    user: UnifiedUser | null;
    accessToken: string | null;
    publicToken: string | null;
    growwAccessToken: string | null;
    loginTime: string | null;

    // ─── Trading Mode ────────────────────────────────────────
    skipOrderConfirmation: boolean;

    // ─── Broker Selection ────────────────────────────────────
    // ─── Broker Selection ────────────────────────────────────
    activeBroker: "KITE" | "GROWW" | "DHAN" | "ANGEL" | "FYERS" | "5PAISA";
    setBroker: (broker: "KITE" | "GROWW" | "DHAN" | "ANGEL" | "FYERS" | "5PAISA") => void;

    // ─── Actions ─────────────────────────────────────────────
    setSession: (user: UnifiedUser, accessToken: string, publicToken: string) => void;
    setGrowwSession: (user: GrowwUser, accessToken: string) => void;
    clearSession: () => void;
    setSkipOrderConfirmation: (skip: boolean) => void;
    login: () => void;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // ─── Default State ───────────────────────────────
            isLoggedIn: false,
            user: null,
            accessToken: null,
            publicToken: null,
            growwAccessToken: null,
            loginTime: null,
            skipOrderConfirmation: false,
            activeBroker: "KITE",

            setBroker: (broker) => set({ activeBroker: broker }),

            // ─── Set Session (called after OAuth callback) ───
            setSession: (user, accessToken, publicToken) =>
                set({
                    isLoggedIn: true,
                    user,
                    accessToken,
                    publicToken,
                    loginTime: new Date().toISOString(),
                }),

            setGrowwSession: async (user, accessToken) => {
                try {
                    await fetch("/api/auth/groww", {
                        method: "POST",
                        body: JSON.stringify({ accessToken, user }),
                    });
                } catch (e) {
                    console.warn("Groww Auth API call failed:", e);
                }
                set({
                    isLoggedIn: true,
                    user,
                    growwAccessToken: accessToken,
                    activeBroker: "GROWW",
                    loginTime: new Date().toISOString(),
                });
            },

            // ─── Clear Session ───────────────────────────────
            clearSession: () =>
                set({
                    isLoggedIn: false,
                    user: null,
                    accessToken: null,
                    publicToken: null,
                    loginTime: null,
                }),

            // ─── Trading Mode ────────────────────────────────
            setSkipOrderConfirmation: (skip) => set({ skipOrderConfirmation: skip }),

            // ─── Login Redirect ──────────────────────────────
            login: () => {
                const apiKey = process.env.NEXT_PUBLIC_KITE_API_KEY || process.env.KITE_API_KEY;
                if (!apiKey) {
                    console.error("❌ [Auth] Missing KITE_API_KEY. Set NEXT_PUBLIC_KITE_API_KEY in Vercel.");
                    return;
                }
                const origin = window.location.origin;
                const redirectUri = encodeURIComponent(`${origin}/api/auth/callback`);
                console.log(`🚀 [Auth] Redirecting to Kite with API Key: ${apiKey.substring(0, 4)}... Orientation: ${origin}`);
                window.location.href = `https://kite.zerodha.com/connect/login?v=3&api_key=${apiKey}&redirect_uri=${redirectUri}`;
            },

            // ─── Logout ──────────────────────────────────────
            logout: async () => {
                try {
                    await Promise.all([
                        fetch("/api/auth/logout", { method: "DELETE" }),
                        fetch("/api/auth/groww", { method: "DELETE" }),
                    ]);
                } catch (e) {
                    console.warn("Logout API calls failed:", e);
                }
                set({
                    isLoggedIn: false,
                    user: null,
                    accessToken: null,
                    publicToken: null,
                    growwAccessToken: null,
                    loginTime: null,
                });
            },
        }),
        {
            name: "cyber-trade-auth",
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state) => ({
                isLoggedIn: state.isLoggedIn,
                user: state.user,
                accessToken: state.accessToken,
                publicToken: state.publicToken,
                growwAccessToken: state.growwAccessToken,
                loginTime: state.loginTime,
                skipOrderConfirmation: state.skipOrderConfirmation,
                activeBroker: state.activeBroker,
            }),
        }
    )
);
