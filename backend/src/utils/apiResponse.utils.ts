type ApiResponse = {
    success: boolean;
    payload: object | null;
};

export const apiResponse = ({success, payload}: ApiResponse): object => {
    return {
        success,
        payload,
    };
};
