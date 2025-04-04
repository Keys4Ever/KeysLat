import { Lock, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import useUrlStore from "../../store/useUrlStore";
import useTagStore from "../../store/useTagsStore";
import AddUrlModal from "../url/AddUrlModal";
import AddSecret from "../secret/AddSecret";

const SearchAndActionBar = () => {
  const [searchBy, setSearchBy] = useState<"short" | "long" | "tags">("short");
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddSecret, setShowAddSecret] = useState(false);

  // Obtenemos tanto urls, selectedTags, filteredUrls y la función para actualizar.
  const { urls, filteredUrls, setFilteredUrls } = useUrlStore();
  const { selectedTags } = useTagStore();
  useEffect(() => {
    if (!Array.isArray(urls)) return;

    let filtered = [...urls];

    // Filtrado por búsqueda según el modo seleccionado.
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((url) => {
        if (searchBy === "short")
          return url.short_url.toLowerCase().includes(query);
        if (searchBy === "long")
          return url.original_url.toLowerCase().includes(query);
        if (searchBy === "tags") {
          return Array.isArray(url.tags) &&
            url.tags.some((t) => t.name.toLowerCase().includes(query));
        }
        return true;
      });
    }

    // Filtrado adicional por tags seleccionadas en la store.
    if (selectedTags.length > 0) {
      filtered = filtered.filter((url) =>
        Array.isArray(url.tags) &&
        url.tags.some((tag) => selectedTags.includes(tag.name))
      );
    }

    // Actualizar solo si es diferente (por ejemplo, comprobando la longitud y los IDs)
    const isDifferent =
      filtered.length !== filteredUrls.length ||
      filtered.some((url, index) => url.id !== filteredUrls[index]?.id);

    if (isDifferent) {
      setFilteredUrls(filtered);
    }
  }, [searchQuery, searchBy, urls, selectedTags, filteredUrls, setFilteredUrls]);

  return (
    <div className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 mb-6">
      {showUrlForm && <AddUrlModal setShowUrlForm={setShowUrlForm} />}
      {showAddSecret && <AddSecret setShowAddSecret={setShowAddSecret} />}

      <div className="relative flex-1 max-w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Buscar por ${
            searchBy !== "tags" ? `${searchBy}...` : "etiquetas..."
          }`}
          className="w-full pl-10 pr-32 py-2 bg-transparent border-2 border-white focus:outline-none"
        />
        <div className="absolute right-0 top-0 h-full">
          <button
            className="h-full px-4 border-l-2 border-white cursor-pointer hover:bg-white hover:text-black transition font-bold"
            onClick={() =>
              setSearchBy((prev) =>
                prev === "short" ? "tags" : prev === "tags" ? "long" : "short"
              )
            }
          >
            {searchBy.toUpperCase()}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap sm:flex-nowrap w-full sm:w-auto gap-4 sm:gap-2">
        <button
          className="flex-1 sm:flex-none px-6 py-2 bg-white cursor-pointer text-black hover:bg-gray-200 transition flex items-center gap-2 justify-center"
          onClick={() => setShowUrlForm(true)}
        >
          <Plus className="w-5 h-5" />
          <span>Nueva URL</span>
        </button>

        <button
          className="flex-1 sm:flex-none px-6 py-2 bg-white cursor-pointer text-black hover:bg-gray-200 transition flex items-center gap-2 justify-center"
          onClick={() => setShowAddSecret(true)}
        >
          <Lock className="w-5 h-5" />
          <span>Usar secreto</span>
        </button>
      </div>
    </div>
  );
};

export default SearchAndActionBar;
