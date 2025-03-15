import { ArrowRight } from "lucide-react";
import { ResultURL } from "./ResultUrl";
import { useState, FormEvent, ChangeEvent } from "react";

const LookURLSection = () => {
    const [url, setUrl] = useState<string | null>(null);
    const [shortUrl, setShortUrl] = useState<string | null>("");
    const [hasTried, setHasTried] = useState(false);

    const handleShortUrlChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setShortUrl(target.value);
    };

    const handleGetUrl = async (e: FormEvent) => {
        e.preventDefault();
        
        if (shortUrl) {
            // Limpiar la URL aquí antes de enviar la petición
            let cleanedUrl = shortUrl.trim();
            const prefixes = ['https://keys.lat/', 'http://keys.lat/', 'keys.lat/'];
            
            prefixes.forEach(prefix => {
                if (cleanedUrl.startsWith(prefix)) {
                    cleanedUrl = cleanedUrl.replace(prefix, '');
                }
            });

            try {
                const response = {
                    original_url: 'https://www.google.com',
                    success: true
                }; // await getOriginalUrl(cleanedUrl);
                console.log(response);
                if (response?.original_url) {
                    setUrl(response.original_url);
                } else {
                    setUrl(null);
                }
            } catch (error) {
                console.error("Error fetching the original URL:", error);
                setUrl(null); 
            } finally {
                setHasTried(true);
            }
        }
    };

    return (
        <section className="max-w-5xl mx-auto px-4 py-24 flex items-center">
            <div className="border-4 border-white p-8 text-left w-full mb-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6">
                    Doubts about a URL? 
                    <br />
                    See where it goes.
                </h2>

                <form className="space-y-6" onSubmit={handleGetUrl}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <input
                            type="text"
                            placeholder="Paste your shortened URL here (e.g., keys.lat/abc123)..."
                            className="flex-1 px-4 py-3 bg-transparent border-2 border-white focus:outline-none focus:border-gray-400 transition w-full"
                            onChange={handleShortUrlChange}
                            value={shortUrl || ""}
                        />
                        <button 
                            type="submit"
                            disabled={!shortUrl?.trim()}
                            className="flex items-center justify-center px-4 sm:px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                            <span className="hidden sm:inline">Check URL</span>
                            <ArrowRight className="w-5 h-5 sm:ml-2" />
                        </button>
                    </div>
                </form>

                {url ? (
                    <ResultURL url={url} />
                ) : hasTried && (
                    <p className="text-white mt-4">No URL found. Please check the shortened URL.</p>
                )}
            </div>
        </section>
    );
};

export default LookURLSection;
