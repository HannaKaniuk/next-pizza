import { create } from "zustand";

type ProductModalPreview = {
  id: number;
  name: string;
  imageUrl: string;
};

type State = {
  preview: ProductModalPreview | null;
  setPreview: (preview: ProductModalPreview) => void;
  clearPreview: () => void;
};

export const useProductModalStore = create<State>((set) => ({
  preview: null,
  setPreview: (preview) => set({ preview }),
  clearPreview: () => set({ preview: null }),
}));
