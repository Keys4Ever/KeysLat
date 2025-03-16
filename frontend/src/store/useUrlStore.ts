import { create } from 'zustand';
import UrlService, { Url } from '../shared/services/UrlService';

interface UrlStore {
  urls: Url[];
  loading: boolean;
  error: string | null;
  fetchUrls: () => Promise<void>;
  addUrl: (url: Url) => void;
  updateUrl: (updatedUrl: Url) => void;
  deleteUrl: (id: number) => void;
  filteredUrls: Url[];
  filterByTags: (selectedTags: string[]) => void;
}

const useUrlStore = create<UrlStore>((set, get) => ({
  urls: [],
  filteredUrls: [],
  loading: false,
  error: null,


  fetchUrls: async () => {
    set({ loading: true, error: null });
    try {
      const response = await UrlService.getAllUrls();
      set({ urls: response.urls, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar URLs', loading: false });
    }
  },

  addUrl: (url) => {
    set((state) => ({ urls: [...state.urls, url] }));
  },

  updateUrl: (updatedUrl) => {
    set((state) => ({
      urls: state.urls.map((url) => (url.id === updatedUrl.id ? updatedUrl : url)),
    }));
  },

  deleteUrl: (id) => {
    set((state) => ({
      urls: state.urls.filter((url) => url.id !== id),
    }));
  },

  filterByTags: (selectedTags) => {
    const { urls } = get();
    if (selectedTags.length === 0) {
      set({ filteredUrls: urls });
    } else {
      const filtered = urls.filter((url) =>
        url.tags.some((tag) => selectedTags.includes(tag.name))
      );
      set({ filteredUrls: filtered });
    }
  },
}));

export default useUrlStore;
