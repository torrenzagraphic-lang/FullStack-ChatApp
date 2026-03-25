import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { expo } from "@better-auth/expo";
import { prisma } from "./db.js";



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        plugins: [expo()],
        enabled: true
    },
    trustedOrigins: [
        "chatapp://",
        ...(process.env.NODE_ENV === "production" ? [
            "exp://",                      // Trust all Expo URLs (prefix matching)
            "exp://**",                    // Trust all Expo URLs (wildcard matching)
            "exp://192.168.*.*:*/**",      // Trust 192.168.x.x IP range with any port and path
        ] : []),
    ],
    debug:process.env.NODE_ENV !== "production",
    allowDangerousConnections:process.env.NODE_ENV !== "production"
});