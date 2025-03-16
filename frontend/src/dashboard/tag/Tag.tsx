import { Edit, X } from "lucide-react";
import TagService from "../../shared/services/TagService";
import useTagStore from "../../store/useTagsStore";
import type { Tag } from "../../shared/interfaces/Tag";

interface Props{
    tag: Tag;
    handleEditTag: (tag: Tag) => void;
}

const TagCard = ({ tag, handleEditTag }: Props) => {
    const { deleteTag, toggleTagSelection, selectedTags } = useTagStore();
    const isSelected = selectedTags.includes(tag.name);

    const handleDelete = async () => {
        try {
            await TagService.deleteTag(tag.id);
            deleteTag(tag.id);
        } catch (error) {
            console.error("Error deleting tag:", error);
            alert("We can't delete the tag. Try again later.");
        }
    };

    return (
        <div className={`flex items-center gap-2 border p-2 whitespace-nowrap cursor-pointer ${isSelected ? "bg-white text-black" : "border-white text-white"}`}>
            <label className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleTagSelection(tag.name)}
                    className="form-checkbox"
                />
                <span title={tag.description}>{tag.name}</span>
            </label>
            <div className="flex items-center gap-1">
                <button className="p-1 hover:bg-white hover:text-black transition" onClick={() => handleEditTag(tag)}>
                    <Edit className="w-4 h-4" />
                </button>
                <button className="p-1 hover:bg-white hover:text-black transition" onClick={handleDelete}>
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default TagCard;