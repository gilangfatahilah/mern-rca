import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { AxiosError } from "axios";
import { AuthUser } from "./useAuthStore";

interface Message {
    senderId: string
    receiverId: string
    text: string
    image?: string
}

interface ChatStore {
    messages: Message[],
    users: AuthUser[],
    selectedUser: AuthUser | null,
    isUsersLoading: boolean,
    isMessagesLoading: boolean,
    getUsers: () => Promise<void>,
    getMessages: (userId: string) => Promise<void>
    setSelectedUser: (user: AuthUser) => void
}

export const useChatStore = create<ChatStore>((set) => ({
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

    // todo:optimize this one later
    setSelectedUser: (user) => set({ selectedUser: user })
}))