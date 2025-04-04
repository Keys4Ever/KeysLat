import { LinkIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import useUrlStore from "../../store/useUrlStore.js";
import { Tag } from "../../shared/interfaces/Tag.js";
import useTagStore from "../../store/useTagsStore.js";
import TagSkeleton from "../skeletons/TagSkeleton.js";

interface Props {
  setShowUrlForm: React.Dispatch<React.SetStateAction<boolean>>;
  edit?: boolean;
  item?: any; // Puedes tipar con Url si lo prefieres
}

const AddUrlModal = ({ setShowUrlForm, edit = false, item = null }: Props) => {
  const [shortUrl, setShortUrl] = useState('');
  const [longUrl, setLongUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<Array<Tag>>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alerta, setAlerta] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<Array<number>>([]);

  const { tags, loading: tagLoading } = useTagStore();
  const { updateUrl, addUrl } = useUrlStore();

  const handleAddOrUpdateUrl = async () => {
    let finalLongUrl = longUrl;
    // Valida y corrige el formato de la URL
    if (!finalLongUrl.startsWith('https://') && !finalLongUrl.startsWith('http://')) {
      setAlerta('We detected that your url doesn\'t start with http:// nor https://, we will add https:// for you. If it should not be https:// edit it.');
      finalLongUrl = 'https://' + finalLongUrl;
    }
    try {
      setError('');
      setIsSubmitting(true);
      if (!finalLongUrl) {
        setError("An URL is required to be shortened");
        return;
      }
      if (edit && item) {
        // Llama al método updateUrl de la store
        await updateUrl(item.id, shortUrl, finalLongUrl, selectedTagIds, description);
      } else {
        // Llama al método addUrl de la store
        await addUrl(shortUrl, finalLongUrl, selectedTagIds, description);
      }
      setShowUrlForm(false);
    } catch (e: any) {
      console.log(e.message);
      if (e.message === "Invalid short URL") {
        setError("La URL corta solo puede contener letras, números y los siguientes caracteres especiales: -._~:/?#[]@!$&'()*+,;=");
      } else {
        setError("Ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (alerta) {
      alert(alerta);
    }
  }, [alerta]);

  useEffect(() => {
    if (edit && item) {
      setShortUrl(item.short_url);
      setLongUrl(item.original_url);
      setDescription(item.description);
      setSelectedTags(item.tags);
      // Extrae los IDs de las tags asignadas al URL para marcar los checkboxes.
      if (item.tags && Array.isArray(item.tags)) {
        setSelectedTagIds(item.tags.map((tag: Tag) => tag.id));
      }
    }
  }, [edit, item]);

  const handleShortUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace('https://keys.lat/', '').trim();
    setShortUrl(inputValue);
    setError('');
  };

  const handleTagSelection = (tagId: number, _tagName: string) => {
    const selectedTag = tags.find((tag) => tag.id === tagId);
    if (!selectedTag) return;
    setSelectedTagIds((prevTagIds) =>
      prevTagIds.includes(tagId) ? prevTagIds.filter((id) => id !== tagId) : [...prevTagIds, tagId]
    );
    setSelectedTags((prevTags) => {
      if (prevTags) {
        return prevTags.some((tag) => tag.id === tagId)
          ? prevTags.filter((tag) => tag.id !== tagId)
          : [...prevTags, selectedTag];
      }
      return [selectedTag];
    });
  };

  return (
    <>
    <div className="fixed inset-0 bg-black opacity-50 flex items-center justify-center z-[101]"></div>
    <div className="fixed inset-0 flex items-center justify-center z-[101]">
      <div className="bg-black border-2 border-white p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{edit ? "Edit URL" : "Add URL"}</h3>
          <button onClick={() => setShowUrlForm(false)} className="p-2 hover:bg-white hover:text-black transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        {error && (
          <div className="mb-4 p-4 bg-red-900 border-2 border-red-500 text-white">
            <p className="text-sm">{error}</p>
          </div>
        )}
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleAddOrUpdateUrl();
          }}
        >
          <div>
            <label className="block mb-2">Short URL</label>
            <input
              type="text"
              value={shortUrl ? `https://keys.lat/${shortUrl}` : ''}
              onChange={handleShortUrlChange}
              placeholder="Leave blank for random"
              className={`w-full p-2 bg-black border-2 ${error ? 'border-red-500' : 'border-white'}`}
            />
          </div>
          <div>
            <label className="block mb-2">Long URL</label>
            <div className={`flex items-center border-2 ${error ? 'border-red-500' : 'border-white'}`}>
              <LinkIcon className="w-5 h-5 mx-2" />
              <input
                type="text"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="https://example.com/..."
                className="flex-1 p-2 bg-transparent focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-transparent border-2 border-white focus:outline-none min-h-[100px]"
              placeholder="Add a description for this URL..."
            />
          </div>
          <div>
            <label className="block mb-2">Tags</label>
            <div className="flex flex-wrap gap-2 p-2 border-2 border-white">
              {tagLoading ? (
                <TagSkeleton />
              ) : tags && tags.length > 0 ? (
                tags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-2 p-2 border border-white">
                    <input
                      type="checkbox"
                      checked={selectedTagIds.includes(tag.id)}
                      onChange={() => handleTagSelection(tag.id, tag.name)}
                      title={tag.description}
                    />
                    {tag.name}
                  </label>
                ))
              ) : (
                <p className="text-white">No tags found</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => setShowUrlForm(false)}
              className="px-4 py-2 border border-white hover:bg-white hover:text-black transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white text-black hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : edit ? "Save Changes" : "Create URL"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default AddUrlModal;
