import {create} from 'zustand'

export const useSocket = create((set)=>({
    socket: null,
    onlineUsers: [],
    setSocket: (socket) => set(()=> ({socket: socket})),
    setOnlineUsers: (users) => set(()=> ({onlineUsers: users}))
}))