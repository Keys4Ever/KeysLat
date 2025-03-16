import { ApiResponse } from "../interfaces/Response";
import httpClient from "../utils/httpClient";

export interface Url {
    id: number;
    shortUrl: string;
    originalUrl: string;
    tags: number[];
    description: string;
}

interface CreateShortUrlResponse extends ApiResponse {
    shortUrl: string;
    originalUrl: string;
    tags: number[];
    description: string;
}

interface GetUrlResponse extends ApiResponse {
    url: Url;
}

interface GetAllUrlsResponse extends ApiResponse {
    urls: Url[];
}

interface DeleteUrlResponse extends ApiResponse {
    message: string;
}

const createShortUrl = async (
    url: string,
    tags?: number[],
    description?: string
): Promise<CreateShortUrlResponse> => {
    const response = await httpClient.post<CreateShortUrlResponse>("/url/create", {
        url,
        tags,
        description,
    });
    return response.data;
};

const getOriginalUrl = async (shortUrl: string): Promise<GetUrlResponse> => {
    const response = await httpClient.get<GetUrlResponse>(`/url/${shortUrl}`);
    return response.data;
};

const getAllUrls = async (): Promise<GetAllUrlsResponse> => {
    const response = await httpClient.get<GetAllUrlsResponse>(`/url/all/`);
    return response.data;
};

const getUrl = async (urlId: number): Promise<GetUrlResponse> => {
    const response = await httpClient.get<GetUrlResponse>(`/url/${urlId}`);
    return response.data;
};

const deleteUrl = async (urlId: number): Promise<DeleteUrlResponse> => {
    const response = await httpClient.delete<DeleteUrlResponse>(`/url/${urlId}`);
    return response.data;
};

const updateUrl = async (
    urlId: number,
    newUrl: string,
    newTags: number[],
    newDescription: string
): Promise<GetUrlResponse> => {
    const response = await httpClient.put<GetUrlResponse>(`/url/${urlId}`, {
        newUrl,
        newTags,
        newDescription,
    });
    return response.data;
};

const UrlService = {
    createShortUrl,
    getOriginalUrl,
    getAllUrls,
    getUrl,
    deleteUrl,
    updateUrl,
};

export default UrlService;