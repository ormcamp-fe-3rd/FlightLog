import { create } from "zustand";

interface LoginModalState {
  isLoginModalOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

const useLoginModalStore = create<LoginModalState>((set) => ({
  isLoginModalOpen: false,
  open: () => set(() => ({ isLoginModalOpen: true })),
  close: () => set(() => ({ isLoginModalOpen: false })),
  toggle: () =>
    set((state: LoginModalState) => ({
      isLoginModalOpen: !state.isLoginModalOpen,
    })),
}));

export default useLoginModalStore;
