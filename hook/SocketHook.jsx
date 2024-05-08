import {create} from 'zustand'

export const useSocket = create((set)=>({
    socket: null,
    onlineUsers: [],
    matchData: null,
    messages: [],
    setMessages: (messages)=> set(()=> ({messages: messages})),
    setMatchData: (matchData)=> set(()=>({matchData: matchData})),
    setSocket: (socket) => set(()=> ({socket: socket})),
    setOnlineUsers: (users) => set(()=> ({onlineUsers: users}))
}))