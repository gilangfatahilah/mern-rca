import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { User } from "../pages/SignUpPage";

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
    signUp: (formData: User) => Promise<void>,
}

export const useAuthStore = create<AuthStore>((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            set({ isCheckingAuth: true });
            const { data } = await axiosInstance.get("/auth/check");
            console.log(data)

            set({ authUser: data })
        } catch (error) {
            console.log("error in check auth " + error)
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signUp: async (formData: User) => {
        set({ isSigningUp: true })
        try {
            const { data } = await axiosInstance.post("/auth/signup", formData);

            set({ authUser: data });
            toast.success("Account created successfully !")
        } catch (error) {
            console.log("error in sign up " + error);
            toast.error("Unexpected error occurred !")
        } finally {
            set({ isSigningUp: false })
        }
    }
}))