import type HTTP_STATUS from "../constants/HttpStatus";

export default class HttpError {
    public description: string;
    public details: string | undefined;
    public status: HTTP_STATUS;

    constructor(statusText: string, error: string, status: number) {
        this.description = statusText;
        this.details = error ?? undefined;
        this.status = status;
    }
}
