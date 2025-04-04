import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

interface UrlInputFormProps {
  isLoading: boolean;
    onShorten: (url: string) => void;
    error: string;
}

const UrlInputForm = ({ isLoading, onShorten, error }: UrlInputFormProps) => {
  const [url, setUrl] = useState('');

const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => setUrl(e.target.value);

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onShorten) onShorten(url);
};

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <input
          type="url"
          placeholder="Paste your long URL here..."
          className="flex-1 px-4 py-3 bg-transparent border-2 border-white focus:outline-none focus:border-gray-400 transition w-full"
          onChange={handleUrlChange}
          value={url}
          disabled={isLoading}
          required
        />
        <button
          type="submit"
          className="flex items-center cursor-pointer justify-center w-full sm:w-auto px-4 sm:px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 transition"
          disabled={isLoading}
        >
          <span className="hidden sm:inline">
            {isLoading ? 'Processing...' : 'Shorten'}
          </span>
          <ArrowRight className="w-5 h-5 sm:ml-2" />
        </button>
      </div>
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </form>
  );
};

export default UrlInputForm;