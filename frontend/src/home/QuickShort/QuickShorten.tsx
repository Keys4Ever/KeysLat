import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UrlInputForm from './components/UrlInputForm';
import { ShortUrlDisplay } from './components/ShortUrlDisplay';
import SecretKeyDisplay from './components/SecretKeyDisplay';
import secretService from '../../shared/services/QuickShort';
import UrlService from '../../shared/services/UrlService';
import useUrlStore from '../../store/useUrlStore';

const QuickShorten = () => {
  const { auth, loading } = useAuth();
  const [shortUrl, setShortUrl] = useState('');
  const [secretKey, setSecretKey] = useState<string>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Importamos las funciones del store que necesitamos
  const { addUrl } = useUrlStore();

  const handleShortenUrl = async (url: string) => {
    setError('');
    setShortUrl('');
    setIsLoading(true);
  
    try {
      const userId = auth.authenticated ? auth.data?.user_id : null;
      
      if (userId) {
        // Usuario autenticado - usar el servicio de URL y actualizar el store
        const response = await UrlService.createShortUrl('', url);
        
        if (!response.success) {
          throw new Error(response.error || 'Error shortening URL');
        }

        console.log('Sonsa: ',response)
        
        // Añadir la URL al store
        await addUrl(response.payload.short_url, url);
        
        const generatedShortUrl = `keys.lat/${response.payload.short_url}`;
        setShortUrl(generatedShortUrl);
      } else {
        // Usuario no autenticado - usar el servicio rápido
        const response = await secretService.quickShort(url);
        console.log('Sonsa2: ', response)
        if (!response.data?.success) {
          throw new Error(response.data?.error || 'Error shortening URL');
        }
        
        const generatedShortUrl = `keys.lat/${response.data.payload.short_url}`;
        setShortUrl(generatedShortUrl);
        
        // Guardar la clave secreta para usuarios no autenticados
        setSecretKey(response.data.payload.secret_key);
      }
  
      // Copiar al portapapeles automáticamente
      await navigator.clipboard.writeText(shortUrl);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 flex items-center">
      <div className="border-4 border-white p-8 text-left w-full mb-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6">
          Shorten your URL quickly and easily
          <br />
          with our service.
        </h2>

        <UrlInputForm
          isLoading={isLoading}
          onShorten={handleShortenUrl}
          error={error}
        />

        {shortUrl && (
          <>
            <ShortUrlDisplay shortUrl={shortUrl} />
            {!loading && secretKey && <SecretKeyDisplay secretKey={secretKey} />}
          </>
        )}
      </div>
    </section>
  );
};

export default QuickShorten;