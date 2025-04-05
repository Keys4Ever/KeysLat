import { useEffect } from 'react';
import { redirect, useParams } from 'react-router-dom';
import httpClient from '../shared/utils/httpClient';
import { ApiResponse } from '../shared/interfaces/Response';

interface ShortUrlResponse extends ApiResponse{
    payload:{
        original_url: string
    }
}

const ShortUrl = () => {

    const params = useParams();
    const shortUrl = params.shortUrl;    
    console.log('useParams: ', params)
    useEffect(() => {
        const fetchUrl = async () => {
            try {
                const response = await httpClient.get<ShortUrlResponse>(`/url/${shortUrl}`);

                if (!response.data.success) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                console.log('response:', response);

                if (response.data.payload.original_url) {

                    window.location.href = response.data.payload.original_url;
                } else if (response.data.payload.original_url) {
                    window.location.href = response.data.payload.original_url;
                } else {
                    
                    redirect('/404');
                    console.error('La respuesta no contiene original_url.');
                }

            } catch (error) {
                window.location.href='/404';
                console.error('Error fetching the URL:', error);
            }
        };

        fetchUrl();
    }, [shortUrl]);

    return null;
};

export default ShortUrl;