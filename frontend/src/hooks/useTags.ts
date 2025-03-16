import { useEffect, useState } from "react";
import { Tag } from "../shared/interfaces/Tag";
import TagService from "../shared/services/TagService";
import { useAuth } from "../context/AuthContext";

const useTags = () => {
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) return;
        fetchTags();
    }, [isAuthenticated]);

    const fetchTags = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await TagService.getTags();
            setTags(response.tags);
        } catch (error) {
            setError("Error while loading tags.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const createTag = async (tag: Tag) => {
        try {
            await TagService.createTag(tag);
            await fetchTags();
        } catch (error) {
            console.error("Error al crear tag:", error);
        }
    };

    const updateTag = async (id: number, tag: Tag) => {
        try {
            await TagService.updateTag(id, tag);
            await fetchTags();
        } catch (error) {
            console.error("Error al actualizar tag:", error);
        }
    };

    const deleteTag = async (id: number) => {
        try {
            await TagService.deleteTag(id);
            setTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
        } catch (error) {
            console.error("Error al eliminar tag:", error);
        }
    };

    return { tags, loading, error, createTag, updateTag, deleteTag, fetchTags };
};

export default useTags;
