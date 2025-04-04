import { ApiResponse } from "../interfaces/Response";
import { Tag } from "../interfaces/Tag";
import httpClient from "../utils/httpClient";

export interface Url {
    id: number;
    short_url: string;
    original_url: string;
    tags: Tag[];
    description: string;
    stats: stats;
    created_at: string;
}

interface stats{
    clicks: number;
    access_date: string;
    url_id: string;
}

interface CreateShortUrlResponse extends ApiResponse {
    payload:{
        id: number;
    short_url: string;
    original_url: string;
    tags: number[];
    stats: stats;
    description: string;
    created_at: string;
    }
}

interface GetUrlResponse extends ApiResponse {
    url: Url;
}

interface GetAllUrlsResponse extends ApiResponse {
    payload: Url[];
}
interface UpdateUrlResponse extends ApiResponse {
    payload: Url;
}
interface DeleteUrlResponse extends ApiResponse {
    message: string;
}

const createShortUrl = async (
    short_url: string,
    original_url: string,
    tags?: number[],
    description?: string
): Promise<CreateShortUrlResponse> => {
    const response = await httpClient.post<CreateShortUrlResponse>("/url/create", {
        original_url,
        short_url,
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
    newShortUrl: string,
    newLongUrl: string,
    newTags: number[],
    newDescription: string
  ): Promise<GetUrlResponse> => {
    const response = await httpClient.put<UpdateUrlResponse>(`/url/${urlId}`, {
      newShortUrl,
      newLongUrl,
      newTags,
      newDescription,
    });
    // Mapeamos payload a url para cumplir con GetUrlResponse
    return { ...response.data, url: response.data.payload };
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