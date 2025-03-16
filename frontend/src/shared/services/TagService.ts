import { ApiResponse } from "../interfaces/Response";
import { Tag } from "../interfaces/Tag";
import httpClient from "../utils/httpClient";

interface GetTagsResponse extends ApiResponse {
    tags: Tag[];
}

interface GetTagResponse extends ApiResponse {
    tag: Tag;
}

interface CreateUpdateTagResponse extends ApiResponse {
    tag: Tag;
}

interface DeleteTagResponse extends ApiResponse {
    message: string;
}

const createTag = async (tag: Tag): Promise<CreateUpdateTagResponse> => {
    const response = await httpClient.post<CreateUpdateTagResponse>('/tags', tag);
    return response.data;
};

const getTags = async (): Promise<GetTagsResponse> => {
    const response = await httpClient.get<GetTagsResponse>('/tags');
    return response.data;
};

const getTag = async (id: number): Promise<GetTagResponse> => {
    const response = await httpClient.get<GetTagResponse>(`/tags/${id}`);
    return response.data;
};

const updateTag = async (id: number, tag: Tag): Promise<CreateUpdateTagResponse> => {
    const response = await httpClient.put<CreateUpdateTagResponse>(`/tags/${id}`, tag);
    return response.data;
};

const deleteTag = async (id: number): Promise<DeleteTagResponse> => {
    const response = await httpClient.delete<DeleteTagResponse>(`/tags/${id}`);
    return response.data;
};

const addTagToUrl = async (tagId: number, urlId: number): Promise<ApiResponse> => {
    const response = await httpClient.post<ApiResponse>(`/tags/${tagId}/urls/${urlId}`);
    return response.data;
};

const TagService = {
    createTag,
    getTags,
    getTag,
    updateTag,
    deleteTag,
    addTagToUrl
};

export default TagService;
