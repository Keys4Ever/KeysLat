import { useState } from 'react';

export const useCopyToClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Resetea el estado después de 2 segundos
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
      setCopied(false);
    }
  };

  return [copied, copyToClipboard];
};