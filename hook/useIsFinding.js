import { create } from "zustand";

const useIsFinding = create((set) => ({
    isFinding: false,
    setIsFinding: (isFinding) => set({ isFinding }),
}));

export default useIsFinding;