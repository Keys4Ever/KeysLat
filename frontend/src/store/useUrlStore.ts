import { create } from "zustand";
import UrlService, { Url } from "../shared/services/UrlService";
import secretService from "../shared/services/QuickShort";

interface UrlStore {
  urls: Url[];
  filteredUrls: Url[];
  loading: boolean;
  error: string | null;
  fetchUrls: () => Promise<void>;
  addUrl: (short_url: string, original_url: string, tags?: number[], description?: string) => Promise<void>;
  addSecretUrl: (secretKey: string) => Promise<Url | null>;
  updateUrl: (urlId: number, newShortUrl: string, newLongUrl: string, newTags: number[], newDescription: string) => Promise<void>;
  deleteUrl: (id: number) => Promise<void>;
  filterByTags: (selectedTags: string[]) => void;
  setFilteredUrls: (filteredUrls: Url[]) => void;
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
      set({ urls: response.payload ?? [], filteredUrls: response.payload ?? [], loading: false });
    } catch (error) {
      set({ error: "Error al cargar URLs", loading: false });
    }
  },

  addUrl: async (short_url, original_url, tags, description) => {
    try {
      const response = await UrlService.createShortUrl(short_url, original_url, tags, description);
      const payload = response.payload;
  
      const newUrl: Url = {
        id: Number(payload.id),
        short_url: payload.short_url,
        original_url: payload.original_url,
        tags: tags
          ? tags.map((tagId) => ({ id: tagId, name: "", description: "" }))
          : [],
        description: payload.description || "",
        stats: {
          clicks: payload.stats.clicks,
          access_date: payload.stats.access_date,
          url_id: payload.stats.url_id,
        },
        created_at: payload.created_at,
      };
  
      set((state) => ({
        urls: [...state.urls, newUrl],
        filteredUrls: [...state.filteredUrls, newUrl],
      }));
    } catch (error) {
      set({ error: "Error al agregar URL" });
    }
  },
  
  // Función actualizada que llama directamente al servicio y usa el tipado correcto
  addSecretUrl: async (secretKey) => {
    set({ loading: true, error: null });
    try {
      const response = await secretService.addSecretToUser(secretKey);
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
      const newUrl = response.data.payload.url;
      // Actualizamos el estado
      set((state) => ({
        urls: [...state.urls, newUrl],
        filteredUrls: [...state.filteredUrls, newUrl],
        loading: false
      }));
      
      return newUrl;
    } catch (error: any) {
      set({ 
        error: error.message || "Error al agregar URL secreta",
        loading: false 
      });
      return null;
    }
  },

  updateUrl: async (urlId, newShortUrl, newLongUrl, newTags, newDescription) => {
    try {
      const response = await UrlService.updateUrl(urlId, newShortUrl, newLongUrl, newTags, newDescription);
      set((state) => ({
        urls: state.urls.map((url) => (url.id === urlId ? response.url : url)),
        filteredUrls: state.filteredUrls.map((url) => (url.id === urlId ? response.url : url)),
      }));
    } catch (error) {
      set({ error: "Error al actualizar URL" });
    }
  },

  deleteUrl: async (id) => {
    try {
      await UrlService.deleteUrl(id);
      set((state) => ({
        urls: state.urls.filter((url) => url.id !== id),
        filteredUrls: state.filteredUrls.filter((url) => url.id !== id),
      }));
    } catch (error) {
      set({ error: "Error al eliminar URL" });
    }
  },

  filterByTags: (selectedTags) => {
    console.log('[filterByTags] Función llamada con selectedTags:', selectedTags);
    
    const { urls } = get();
    console.log('[filterByTags] Número total de URLs disponibles:', urls.length);
  
    if (selectedTags.length === 0) {
      console.log('[filterByTags] Mostrando todas las URLs (sin filtros)');
      set({ filteredUrls: urls });
    } else {
      console.log('[filterByTags] Filtrando por tags:', selectedTags);
      
      const filtered = urls.filter((url) => {
        // Añadir validación para tags null/undefined
        const urlTags = url.tags || [];
        console.log(`[filterByTags] Procesando URL ${url.id} - tags:`, urlTags.map(t => t?.name));
  
        const hasMatch = urlTags.some((tag) => {
          // Validar tag exista y tenga name
          const tagName = tag?.name?.trim();
          if (!tagName) return false;
          
          const match = selectedTags.includes(tagName);
          console.log(`[filterByTags] Comparando "${tagName}" vs selección: ${match}`);
          return match;
        });
  
        console.log(`[filterByTags] URL ${url.id} ${hasMatch ? 'PASA' : 'NO PASA'} el filtro`);
        return hasMatch;
      });
  
      console.log('[filterByTags] Resultados del filtrado:', {
        totalURLs: urls.length,
        filteredCount: filtered.length,
        filteredSample: filtered.slice(0, 5)
      });
      
      set({ filteredUrls: filtered });
    }
  },
  setFilteredUrls: (filteredUrls: Url[]) => {
    set({ filteredUrls });
  },
}));

export default useUrlStore;