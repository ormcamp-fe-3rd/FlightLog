import { create } from "zustand";

interface SidebarState {
  isSidebarOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
  isSidebarOpen: true,
  open: () => set(() => ({ isSidebarOpen: true })),
  close: () => set(() => ({ isSidebarOpen: false })),
  toggle: () =>
    set((state: SidebarState) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));

export default useSidebarStore;
