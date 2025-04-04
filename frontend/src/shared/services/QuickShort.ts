import { ApiResponse } from "../interfaces/Response";
import httpClient from "../utils/httpClient";
import { Url } from "./UrlService";

interface QuickShortResponse extends ApiResponse {
  payload: {
    short_url: string;
    secret_key: string;
  }
}

export interface addSecretToUserResponse extends ApiResponse {
  payload: {
    url: Url
  };
}



const quickShort = (url: string) => {
  return httpClient.post<QuickShortResponse>("/url/quick-short", { original_url: url });
}

const addSecretToUser = async (secretKey: string) => {
  return httpClient.post<addSecretToUserResponse>("/user/add-secret", { secret_key: secretKey });
}

const secretService = {
    addSecretToUser,
    quickShort
}

export default secretService