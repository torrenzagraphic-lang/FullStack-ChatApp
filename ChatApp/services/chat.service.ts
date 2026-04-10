import { API_URL } from "@/utils";
import { authClient } from "./../utils/auth-client";

async function getHeaders() {
    const cookie = authClient.getCookie?.() ?? "";
    return {
        "Content-Type": "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
    };
}

export interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
}
export interface ChatUser {
    id: string;
    name: string;
    image?: string;
    lastMessage?: Message | null;
    unreadCount?: number;
}

export const chatService = {
    sendMessage: async (receiverId: string, content: string) => {
        const headers = await getHeaders();
        const res = await fetch(`${API_URL}/chat/send`, {
            method: "POST",
            headers,
            body: JSON.stringify({ receiverId, content }),
        });

        const data = await res.clone().json();
        if (!res.ok) throw new Error("Failed to send Messages");
        return data;
    },
    getMessage: async () => {},
    getConversation: async () => {},
    markRead: async () => {},
};
