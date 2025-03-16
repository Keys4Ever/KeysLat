import { ApiResponse } from "../interfaces/Response";
import httpClient from "../utils/httpClient";

interface QuickShortResponse extends ApiResponse {
  shortUrl: string;
  secretKey: string;
}

export interface addSecretToUserResponse extends ApiResponse {
  newUrl: {
    urlId: number;
    shortUrl: string;
    originalUrl: string;
    clicks: number;
    date: string;
  };
}



const quickShort = (url: string) => {
  return httpClient.post<QuickShortResponse>("/url/quick-short", { url });
}

const addSecretToUser = async (secretKey: string) => {
  return httpClient.post<addSecretToUserResponse>("/user/add-secret", { secretKey });
}

const secretService = {
    addSecretToUser,
    quickShort
}

export default secretService