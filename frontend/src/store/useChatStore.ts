import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { AxiosError } from "axios";
import { AuthUser, useAuthStore } from "./useAuthStore";

interface Message {
    _id: string
    senderId: string
    receiverId: string
    text: string
    image?: string
    createdAt: Date
    updatedAt: Date
}

interface ChatStore {
    messages: Message[],
    users: AuthUser[],
    selectedUser: AuthUser | null,
    isUsersLoading: boolean,
    isMessagesLoading: boolean,
    getUsers: () => Promise<void>,
    getMessages: (userId: string) => Promise<void>
    setSelectedUser: (user: AuthUser | null) => void
    sendMessage: (message: { text: string, image: string | null }) => Promise<void>
    subscribeToMessages: () => void
    unsubscribeToMessages: () => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });

        try {
            const { data } = await axiosInstance.get("/messages/users");
            set({ users: data.data });
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message + ", Please try ag !ain");
            } else {
                toast.error("Unexpected error occurred !");
            }
        } finally {
            set({ isUsersLoading: false })
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });

        try {
            const { data } = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: data.data });
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message + ", Please try ag !ain");
            } else {
                toast.error("Unexpected error occurred !");
            }
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async (message) => {
        const { selectedUser, messages } = get();

        if (!selectedUser) return;

        try {
            const { data } = await axiosInstance.post(`/messages/send/${selectedUser._id}`, message);
            set({ messages: [...messages, data.data] });
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message + ", Please try ag !ain");
            } else {
                toast.error("Unexpected error occurred !");
            }
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();

        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket?.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage]
            })
        })
    },

    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    setSelectedUser: (user) => set({ selectedUser: user })
}))