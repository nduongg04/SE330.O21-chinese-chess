import {create} from 'zustand'

export const useSession = create((set)=>({
    user: null,
    setUser: (user) => set(()=> ({user: user})),
}))