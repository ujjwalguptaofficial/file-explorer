import { create } from "zustand";

export interface IFileStore {
    files: {
        id: number,
        type: "folder" | "file",
        name: string,
        locked?: boolean
    }[];
    parentId: number;
    add: (file: { type: "folder" | "file", name: string }) => void;
    set: (files: { type: "folder" | "file", name: string }[]) => void;
    setParentId: (id: number) => void;
    // increment: () => void;
    // decrement: () => void;
}

export const files = create<IFileStore>((set) => ({
    files: [
        {
            id: 1, type: "folder", name: "folder 1", parent: null,
            children: [
                {
                    id: 10, type: "file", name: "file1.js", parent: 1
                }
            ]
        }, { id: 2, type: "file", name: "file1.js", parent: null }
    ],
    parentId: 0,
    add(file: any) {
        set((state) => ({ files: [...state.files, file] }));
    },
    set(files: any[]) {
        set((state) => ({ files: files }));
    },
    setParentId(id: number) {
        set((state) => ({ parentId: id }));
    }
    // increment() {
    //     set((state) => ({ items: state.items + 1 }));
    // },
    // decrement() {
    //     set((state) => ({ items: state.items - 1 }));
    // }
}));
