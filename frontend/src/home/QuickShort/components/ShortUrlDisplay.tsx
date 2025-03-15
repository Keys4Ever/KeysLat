import { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface ShortUrlDisplayProps {
  shortUrl: string;
}

export const ShortUrlDisplay = ( { shortUrl }: ShortUrlDisplayProps ) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Failed to copy URL.');
    }
  };

  return (
    <div className="p-4 border-2 border-white mt-6">
      <div className="flex items-center justify-between">
        <span className="font-bold">{shortUrl}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 text-sm hover:underline"
        >
          {copied ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Copy className="w-5 h-5" />
          )}
          {copied ? 'Copied!' : 'Copy URL'}
        </button>
      </div>
    </div>
  );
};
