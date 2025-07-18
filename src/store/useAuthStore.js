import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =  import.meta.env.MODE === "development" ? "http://localhost:5001" : "https://chat-app-backend-a0h3.onrender.com"

export const useAuthStore = create((set,get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    isCheckingAuth: true,
    socket:null,

    checkAuth: async() => {
        try {
            const response = await axiosInstance.get("/api/auth/check")
            set({authUser: response.data})
            get().connectSocket()
        } catch (error) {
            set({authUser: null})
            console.log("Error in CheckAuth: ",error)
        } finally {
            set({ isCheckingAuth: false })
        }
    },

    signUp: async(data) => {
        set({ isSigningUp: true })
        try {
            const response = await axiosInstance.post("/api/auth/signup",data)
            set({ authUser: response.data })
            toast.success("Account created successfully")
            get().connectSocket()
        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    logout: async() => {
        try {
            await axiosInstance.post("/api/auth/logout")
            set({ authUser: null })
            toast.success("Logged out successfully")
            get().disconnectSocket()
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    },

    login: async(data) => {
        set({ isLoggingIn: true })
        try {
            const response = await axiosInstance.post("/api/auth/login",data)
            set({ authUser: response.data })
            toast.success("Logged in successfully")
            get().connectSocket()

        } catch (error) {
            toast.error(error?.response?.data?.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },

    updateProfile: async(data) => {
        set({ isUpdatingProfile: true })
        try {
            const response = await axiosInstance.put("/api/auth/update-profile",data)
            set({ authUser: response.data })
            toast.success("Profile updated successfully")

        } catch (error) {
            console.log("error ",error)
            toast.error(error?.response?.data?.message)
        } finally {
            set({ isUpdatingProfile: false })
        }
    },

    connectSocket: () => {
        const { authUser } = get()
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: get().authUser._id
            }
        })
        socket.connect()

        set({ socket: socket })

        socket.on('getOnlineUsers', (userIds) => {
            set({ onlineUsers: userIds })
        })
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect()
        
    }

}))