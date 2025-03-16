import { useState } from "react";
import { Plus } from "lucide-react";
import useTagStore from "../../store/useTagsStore";
import TagSkeleton from "../skeletons/TagSkeleton";
import AddTagModal from "./AddTagModal";
import type { Tag } from "../../shared/interfaces/Tag";
import TagCard from "./Tag";

const TagsSection = () => {
    const { tags, loading: isLoading } = useTagStore();
    const [showAddForm, setShowAddForm] = useState(false);
    const [tagToEdit, setTagToEdit] = useState<Tag>();
    const [edit, setEdit] = useState(false);

    const handleAddTag = () => {
        setShowAddForm(true);
        setEdit(false);
    };

    const handleEditTag = (tag: Tag) => {
        setEdit(true);
        setTagToEdit(tag);
        setShowAddForm(true);
    };

    return (
        <div className="border-2 border-white p-4 mb-6">
            {showAddForm && (
                <AddTagModal
                    setShowAddForm={setShowAddForm}
                    tag={tagToEdit}
                    edit={edit}
                />
            )}

            <div 
                className="flex overflow-x-auto gap-2 mb-4 pb-2 scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent"
                style={{
                    WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
                    scrollbarWidth: 'thin', // Firefox smooth scrollbar
                }}
            >
                {isLoading ? (
                    <>
                        <TagSkeleton bigTag />
                        <TagSkeleton bigTag />
                    </>
                ) : tags.length === 0 ? (
                    <p className="text-white">No tags found</p>
                ) : (
                    tags.map((tag) => (
                        <div key={tag.id} className="flex-shrink-0">
                            <TagCard
                                tag={tag}
                                handleEditTag={handleEditTag}

                            />
                        </div>
                    ))
                )}
            </div>

            <button
                onClick={handleAddTag}
                className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition"
            >
                <Plus className="w-4 h-4" />
                Add Tag
            </button>
        </div>
    );
};

export default TagsSection;
