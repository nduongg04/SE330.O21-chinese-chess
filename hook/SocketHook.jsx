import {create} from 'zustand'

export const useSocket = create((set)=>({
    socket: null,
    onlineUsers: [],
    matchData: null,
    setMatchData: (matchData)=> set(()=>({matchData: matchData})),
    setSocket: (socket) => set(()=> ({socket: socket})),
    setOnlineUsers: (users) => set(()=> ({onlineUsers: users}))
}))