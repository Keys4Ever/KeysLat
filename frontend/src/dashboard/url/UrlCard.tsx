import { useState } from 'react';
import { Copy, Edit, Trash2, QrCode, Check } from 'lucide-react';
import QRCode from 'qrcode';
import useUrlStore from '../../store/useUrlStore';
import UrlService, { Url } from '../../shared/services/UrlService';
import { Tag } from '../../shared/interfaces/Tag';
import AddUrlModal from './AddUrlModal';

interface Props{
    item: Url;
}

const UrlCard = ({ item }: Props) => {
  const shortUrl = "https://keys.lat/" + item.shortUrl;

  const [showUrlForm, setShowUrlForm] = useState(false);
  const [copying, setCopying] = useState(false);
  const [qrCopied, setQrCopied] = useState(false);
  const { deleteUrl } = useUrlStore();

  const handleCopyUrl = async () => {
    setCopying(true);
    await navigator.clipboard.writeText(shortUrl);
    setTimeout(() => setCopying(false), 2000);
  };

  const copyQrCode = async () => {
    try {
      setQrCopied(true);
      const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);
      const blob = await (await fetch(qrCodeDataUrl)).blob();
      const clipboardItem = new ClipboardItem({ 'image/png': blob });
      await navigator.clipboard.write([clipboardItem]);
      alert('QR Copied to clipboard');
      setTimeout(() => setQrCopied(false), 2000);
    } catch (error) {
      console.error('Error al copiar el QR:', error);
      setQrCopied(false);
    }
  };

  const handleEditUrl = () => {
    setShowUrlForm(true);
  };

  const handleDeleteUrl = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta URL?')) {
      try {
        await UrlService.deleteUrl(item.id);
        deleteUrl(item.id);
      } catch (error) {
        console.error('Error al eliminar la URL:', error);
        alert('Error deleting URL. Try again later. \nIf the problem persists, contact the administrator.');
      }
    }
  };

  return (
    <>
      {showUrlForm && (
        <AddUrlModal
          setShowUrlForm={setShowUrlForm}
          edit={true}
          item={item}
        />
      )}
      <div className="p-4 border-2 border-white">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-2 space-y-2 sm:space-y-0">
          <div className="w-full sm:w-auto">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-mono">{shortUrl || "URL no disponible"}</span>
              <button
                className="p-1 hover:bg-white hover:text-black transition rounded"
                onClick={handleCopyUrl}
                title='Copy short url'
              >
                {copying ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                className="p-1 hover:bg-white hover:text-black transition rounded"
                onClick={copyQrCode}
                title='Copy short url as QRCode'
              >
                {qrCopied ? <Check className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-gray-400 text-sm break-all max-w-full">
              {item.originalUrl || "URL completa no disponible"}
            </p>
            {item.description && (
              <p className="text-sm text-gray-400 mt-1 max-w-full">{item.description}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 w-full sm:w-auto">
            <div className="text-right sm:text-right">
              <p className="font-bold truncate max-w-full">
                {item.clics !== undefined ? `${item.clics} clicks` : "Clicks not available"}
              </p>
              <p className="text-sm text-gray-400 truncate max-w-full">{item.created_at || "Date not available, refresh the page."}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                className="p-2 hover:bg-white hover:text-black transition rounded" 
                onClick={handleEditUrl}
              >
                <Edit className="w-5 h-5" />
              </button>
              <button 
                className="p-2 hover:bg-white hover:text-black transition rounded"
                onClick={handleDeleteUrl}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {item.tags.map((tag: Tag) => (
            <span 
              key={tag.id} 
              className="px-2 py-1 border border-gray-400 text-sm text-gray-400 truncate max-w-full"
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default UrlCard;