import { create } from "zustand";
import TagService from "../shared/services/TagService";
import { Tag } from "../shared/interfaces/Tag";
import useUrlStore from "./useUrlStore"; // Importar para filtrar URLs

interface TagStore {
  tags: Tag[];
  selectedTags: string[];
  loading: boolean;
  fetchTags: () => Promise<void>;
  addTag: (tag: Tag) => void;
  updateTag: (id: number, updatedTag: Tag) => void;
  deleteTag: (id: number) => void;
  toggleTagSelection: (tagName: string) => void;
}

const useTagStore = create<TagStore>((set, _get) => ({
  tags: [],
  selectedTags: [],
  loading: false,

  fetchTags: async () => {
    set({ loading: true });
    try {
      const response = await TagService.getTags();
      set({ tags: response.tags, loading: false });
    } catch (error) {
      console.error("Error al cargar Tags", error);
      set({ loading: false });
    }
  },

  addTag: (tag) => {
    set((state) => ({ tags: [...state.tags, tag] }));
  },

  updateTag: (id, updatedTag) => {
    set((state) => ({
      tags: state.tags.map((tag) => (tag.id === id ? updatedTag : tag)),
    }));
  },

  deleteTag: (id) => {
    set((state) => ({
      tags: state.tags.filter((tag) => tag.id !== id),
    }));
  },

  toggleTagSelection: (tagName) => {
    set((state) => {
      const updatedTags = state.selectedTags.includes(tagName)
        ? state.selectedTags.filter((tag) => tag !== tagName)
        : [...state.selectedTags, tagName];

      useUrlStore.getState().filterByTags(updatedTags);
      return { selectedTags: updatedTags };
    });
  },
}));

export default useTagStore;
