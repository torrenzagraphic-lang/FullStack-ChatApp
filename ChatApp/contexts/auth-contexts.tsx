import { authClient } from "@/utils/auth-client";
import { AuthClient } from "better-auth/client";

import React, { createContext, useContext } from "react";

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    image?: string | null;
}

interface AuthContextType {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    SignIn: (email: string, password: string) => Promise<string | null>;
    signOut: () => Promise<void>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const signIn = async (
        email: string,
        password: string,
    ): Promise<string | null> => {
        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password,
            });
            if (error) {
                return error.message ?? "Sign in filed";
            }
            return null;
        } catch (error) {
            return "Sign in failed";
        }
    };
    const signUp = async (
        name:string,
        email: string,
        password: string,
    ): Promise<string | null> => {
        try {
            const { data, error } = await authClient.signUp.email({
                name,
                email,
                password,
            });
            if (error) {
                return error.message ?? "Sign up filed";
            }
            return null;
        } catch (error) {
            return "Sign in failed";
        }
    };
}
