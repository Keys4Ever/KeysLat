import { ApiResponse } from "../interfaces/Response";
import httpClient from "../utils/httpClient";

interface QuickShortResponse extends ApiResponse {
  shortUrl: string;
  secretKey: string;
}


const quickShort = (url: string) => {
  return httpClient.post<QuickShortResponse>("/url/quick-short", { url });
}

const addSecretToUser = async (userId: string, secretKey: string) => {
  return httpClient.post<ApiResponse>("/user/add-secret", { userId, secretKey });
}

const secretService = {
    addSecretToUser,
    quickShort
}

export default secretService