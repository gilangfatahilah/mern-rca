import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { User } from "../pages/SignUpPage";
import { AxiosError } from "axios";

export interface AuthUser {
    _id: string,
    fullName: string,
    email: string,
    profilePic?: string
}

interface AuthStore {
    authUser: AuthUser | null,
    isSigningUp: boolean,
    isLoggingIn: boolean,
    isUpdatingProfile: boolean,
    isCheckingAuth: boolean,
    checkAuth: () => Promise<void>,
    login: (formData: Omit<User, "fullName">) => Promise<void>,
    signUp: (formData: User) => Promise<void>,
    logout: () => Promise<void>,
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        set({ isCheckingAuth: true });

        try {
            const { data } = await axiosInstance.get("/auth/check");
            set({ authUser: data })
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
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.message + ", Please try again !");
            } else {
                toast.error("Unexpected error occurred !");
            }
        }
    }
}))