import { create } from "zustand";
import TagService from "../shared/services/TagService";
import { Tag } from "../shared/interfaces/Tag";
import useUrlStore from "./useUrlStore";

interface TagStore {
  tags: Tag[];
  selectedTags: string[];
  loading: boolean;
  fetchTags: () => Promise<void>;
  addTag: (tag: Tag) => Promise<void>;
  updateTag: (id: number, updatedTag: Tag) => Promise<void>;
  deleteTag: (id: number) => Promise<void>;
  toggleTagSelection: (tagName: string) => void;
}

const useTagStore = create<TagStore>((set, get) => ({
  tags: [],
  selectedTags: [],
  loading: false,

  fetchTags: async () => {
    set({ loading: true });
    try {
      const response = await TagService.getTags();
      set({ tags: response.payload, loading: false });
    } catch (error) {
      console.error("Error al cargar Tags", error);
      set({ loading: false });
    }
  },

  addTag: async (tag) => {
    try {
      const response = await TagService.createTag(tag);
      set((state) => ({ tags: [...state.tags, response.payload] }));
    } catch (error) {
      console.error("Error al crear tag", error);
    }
  },

  updateTag: async (id, updatedTag) => {
    try {
      const response = await TagService.updateTag(id, updatedTag);
      
      // Actualizar tag en el estado local
      set((state) => ({
        tags: state.tags.map((tag) => (tag.id === id ? response.payload : tag)),
      }));
      
      // Sincronizar URLs que usan este tag
      const urlStore = useUrlStore.getState();
      const updatedUrls = urlStore.urls.map(url => {
        // Verificar si esta URL usa el tag actualizado
        const hasUpdatedTag = url.tags?.some(tag => tag.id === id);
        
        if (hasUpdatedTag) {
          // Actualizar el tag en esta URL
          return {
            ...url,
            tags: url.tags.map(tag => 
              tag.id === id 
                ? { ...tag, name: response.payload.name, description: response.payload.description }
                : tag
            )
          };
        }
        return url;
      });
      
      // Actualizar el store de URLs
      urlStore.setFilteredUrls(updatedUrls);
      
      // Re-aplicar el filtro actual si hay tags seleccionados
      if (get().selectedTags.length > 0) {
        urlStore.filterByTags(get().selectedTags);
      }
      
    } catch (error) {
      console.error("Error al actualizar tag", error);
    }
  },

  deleteTag: async (id) => {
    try {
      await TagService.deleteTag(id);
      
      // Eliminar tag del estado local
      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
        // Si el tag eliminado estaba seleccionado, quitarlo de selectedTags
        selectedTags: state.selectedTags.filter(tagName => {
          const deletedTag = state.tags.find(t => t.id === id);
          return deletedTag?.name !== tagName;
        })
      }));
      
      // Sincronizar URLs que usan este tag
      const urlStore = useUrlStore.getState();
      const updatedUrls = urlStore.urls.map(url => {
        // Verificar si esta URL usa el tag eliminado
        const hasDeletedTag = url.tags?.some(tag => tag.id === id);
        
        if (hasDeletedTag) {
          // Eliminar el tag de esta URL
          return {
            ...url,
            tags: url.tags.filter(tag => tag.id !== id)
          };
        }
        return url;
      });
      
      // Actualizar el store de URLs
      urlStore.setFilteredUrls(updatedUrls);
      
      // Re-aplicar el filtro actual si hay tags seleccionados
      const currentSelectedTags = get().selectedTags;
      if (currentSelectedTags.length > 0) {
        urlStore.filterByTags(currentSelectedTags);
      }
      
    } catch (error) {
      console.error("Error al eliminar tag", error);
    }
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