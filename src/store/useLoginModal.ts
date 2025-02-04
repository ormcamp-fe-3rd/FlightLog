import { create } from "zustand";

interface LoginModalState {
  isLoginModalOpen: boolean;
  isRegisterView: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setRegisterView: (isRegister: boolean) => void;
  reset: () => void;
}

const useLoginModalStore = create<LoginModalState>((set) => ({
  isLoginModalOpen: false,
  isRegisterView: false,
  open: () => set(() => ({ isLoginModalOpen: true })),
  close: () => set(() => ({ isLoginModalOpen: false })),
  toggle: () =>
    set((state) => ({
      isLoginModalOpen: !state.isLoginModalOpen,
    })),
  setRegisterView: (isRegister) => set(() => ({ isRegisterView: isRegister })),
  reset: () => set(() => ({ isLoginModalOpen: false, isRegisterView: false })),
}));

export default useLoginModalStore;
