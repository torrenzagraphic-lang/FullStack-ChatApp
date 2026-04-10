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
    sendMessage: async (receiverId: string, content: string) => {},
    getMessage: async () => {},
    getConversation: async () => {},
    markRead: async () => {},
};
