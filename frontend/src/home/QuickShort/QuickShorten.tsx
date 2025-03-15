import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UrlInputForm from './components/UrlInputForm';
import { ShortUrlDisplay } from './components/ShortUrlDisplay';
import SecretKeyDisplay from './components/SecretKeyDisplay';

const QuickShorten = () => {
  const { auth, loading } = useAuth();
  const [shortUrl, setShortUrl] = useState('');
  const [secretKey, setSecretKey] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleShortenUrl = async (url: string) => {
    setError('');
    setShortUrl('');
    setIsLoading(true);

    try {
      const userId = auth.authenticated ? auth.data?.user_id : null;
      const response = userId
       // ? await createShortUrl(userId, url)
       // : await quickShort(url); 
       // Implement those methods
      console.log(response);
      if (!response.success && !auth.authenticated) throw new Error(response.error || 'Error shortening URL');

      const generatedShortUrl = `keys.lat/${ response.url }`;
      setShortUrl(generatedShortUrl);

      if (!auth.authenticated) {
        setSecretKey(response.secretKey);
      }

      await navigator.clipboard.writeText(generatedShortUrl);
    } catch (err: any) {
      setError(err.message);
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