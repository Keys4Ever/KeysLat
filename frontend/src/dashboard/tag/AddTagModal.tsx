import { X } from "lucide-react";
import { useState, FormEvent } from "react";
import { Tag } from "../../shared/interfaces/Tag";
import useTagStore from "../../store/useTagsStore";

interface Props {
    setShowAddForm: React.Dispatch<React.SetStateAction<boolean>>;
    tag?: Tag;
    edit: boolean;
}

const AddTagModal = ({ setShowAddForm, tag, edit }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const { addTag, updateTag } = useTagStore();

    const [tagNew, setTagNew] = useState<Tag>({
        id: tag?.id || 0,
        name: tag?.name || '',
        description: tag?.description || '',
    });

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        if (tagNew.name.length < 1) {
            alert("Tag name cannot be empty");
            setIsLoading(false);
            return;
        }
        if (tagNew.name.length > 20) {
            alert("Tag name cannot be longer than 20 characters");
            setIsLoading(false);
            return;
        }

        try {
            if (edit) {
                await updateTag(tagNew.id, tagNew);
                alert("Tag updated successfully :D");
            } else {
                await addTag(tagNew);
                alert("Tag added successfully :D");
            }
            setShowAddForm(false);
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black opacity-25 z-[100]"></div>
            <div className="fixed inset-0 flex items-center justify-center z-[101]">
                <div className="bg-black border-2 opacity-100 border-white p-6 max-w-md w-full mx-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">{edit ? "Edit Tag" : "Add New Tag"}</h3>
                    <button 
                        onClick={() => setShowAddForm(false)} 
                        className="p-2 hover:bg-white hover:text-black transition"
                        disabled={isLoading}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-2">Tag Name</label>
                        <input
                            type="text"
                            placeholder="Enter tag name"
                            required
                            disabled={isLoading}
                            value={tagNew.name}
                            onChange={(e) => setTagNew((prev) => ({ ...prev, name: e.target.value }))}
                            className={`w-full p-2 bg-transparent border-2 border-white focus:outline-none ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        />
                    </div>
                    <div>
                        <label className="block mb-2">Description</label>
                        <textarea
                            className={`w-full p-2 bg-transparent border-2 border-white focus:outline-none min-h-[100px] ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            placeholder="Add a description for this tag..."
                            value={tagNew.description}
                            onChange={(e) => setTagNew((prev) => ({ ...prev, description: e.target.value }))}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className={`px-4 py-2 border border-white hover:bg-white hover:text-black transition ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 bg-white text-black hover:bg-gray-200 transition ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : (edit ? "Save Changes" : "Add Tag")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default AddTagModal;
