export const correctResponse = (message: string, data?: any) => {
    return {
        success: true,
        message,
        data
    };
};

export const incorrectResponse = (message: string, data?: any) => {
    return {
        success: false,
        message,
        data
    };
};