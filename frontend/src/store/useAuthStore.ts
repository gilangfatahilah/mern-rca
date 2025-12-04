import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { User } from "../pages/SignUpPage";
import { AxiosError } from "axios";
import { io, Socket } from "socket.io-client";

export interface AuthUser {
  _id: string,
  fullName: string,
  email: string,
  profilePic?: string,
  createdAt: string,
  updateAt?: string,
}

interface AuthStore {
  authUser: AuthUser | null,
  onlineUsers: string[],
  isSigningUp: boolean,
  isLoggingIn: boolean,
  isUpdatingProfile: boolean,
  isCheckingAuth: boolean,
  socket: Socket | null;
  checkAuth: () => Promise<void>,
  login: (formData: Omit<User, "fullName">) => Promise<void>,
  signUp: (formData: User) => Promise<void>,
  logout: () => Promise<void>,
  updateProfile: (formData: { profilePic: string }) => Promise<void>
  connectSocket: () => void;
  disconnectSocket: () => void;
}

const BASE_URL = import.meta.env.VITE_API_URL;

export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  onlineUsers: [],
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const { data } = await axiosInstance.get("/auth/check");
      set({ authUser: data });

      get().connectSocket();
    } catch (error) {
      console.error("error in check auth " + error)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true })

    try {
      const { data } = await axiosInstance.post("/auth/login", formData);
      set({ authUser: data.data })

      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message + ", Please try ag !ain");
      } else {
        toast.error("Unexpected error occurred !");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signUp: async (formData: User) => {
    set({ isSigningUp: true })

    try {
      const { data } = await axiosInstance.post("/auth/signup", formData);

      set({ authUser: data.data });
      toast.success("Account created successfully.")

      get().connectSocket();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message + ", Please try again !");
      } else {
        toast.error("Unexpected error occurred !");
      }
    } finally {
      set({ isSigningUp: false })
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Successfully logged out.")
      get().disconnectSocket();
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message + ", Please try again !");
      } else {
        toast.error("Unexpected error occurred !");
      }
    }
  },

  updateProfile: async (formData: { profilePic: string }) => {
    set({ isUpdatingProfile: true });

    try {
      console.log(formData);

      const { data } = await axiosInstance.put("/auth/update-profile", formData);
      set({ authUser: data.data });
      toast.success("Profile updated successfully.")
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message + ", Please try again !");
      } else {
        toast.error("Unexpected error occurred !");
      }
    } finally {
      set({ isUpdatingProfile: false })
    }
  },

  connectSocket: () => {
    const { authUser } = get();

    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      set({ onlineUsers: userIds })
    })
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket?.disconnect();
  }
}))
