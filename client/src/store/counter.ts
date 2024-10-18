import { create } from "zustand";

export interface ICounterStore {
    count: number;
    increment: () => void;
    decrement: () => void;
}

export const count = create<ICounterStore>((set) => ({
    count: 0, increment() {
        set((state) => ({ count: state.count + 1 }));
    },
    decrement() {
        set((state) => ({ count: state.count - 1 }));
    }
}));
