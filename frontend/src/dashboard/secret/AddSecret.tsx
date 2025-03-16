import { FormEvent, useState } from 'react';
import { Plus } from "lucide-react";
import secretService from '../../shared/services/QuickShort';
import useUrlStore from '../../store/useUrlStore';

interface Props{
    setShowAddSecret: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddSecret = ({ setShowAddSecret }: Props ) => {
    const [secret, setSecret] = useState('');
    const [res, setRes] = useState({
        error: false,
        message: ''
    });

    const { addUrl } = useUrlStore();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!secret.trim()) {
            setRes({
                error: true,
                message: 'Please enter a secret'
            });
            return;
        }

        try {
            const response = await secretService.addSecretToUser(secret);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            console.log(response);

            const newUrl = {
                id: response.data.newUrl.urlId,
                shortUrl: response.data.newUrl.shortUrl,
                originalUrl: response.data.newUrl.originalUrl,
                description: '',
                tags:[],
                clics: response.data.newUrl.clicks,
                created_at: response.data.newUrl.date
            }
            
            addUrl(newUrl);

            setSecret('');
            setRes({
                error: false,
                message: 'Secret added successfully'
            });

            setShowAddSecret(false);
        } catch (err: any) {
            setRes({
                error: true,
                message: err.message || 'Failed to add secret URL'
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <form 
                onSubmit={handleSubmit}
                className="bg-black border-2 border-white w-full max-w-md"
            >
                <div className="p-6">
                    <input
                        type="text"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="Enter secret URL"
                        className="w-full px-3 py-2 bg-transparent border-2 border-white focus:outline-none"
                    /> 
                    {res.message && (
                        <p className={`mt-2 ${res.error ? 'text-red-400' : 'text-green-400'}`}>{res.message}</p>
                    )}
                </div>
                <div className="flex border-t-2 border-white">
                    <button
                        type="button"
                        className="w-1/2 py-2 border-r-2 border-white hover:bg-white hover:text-black transition"
                        onClick={() => setShowAddSecret(false)}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="w-1/2 py-2 bg-white text-black hover:bg-gray-200 transition flex justify-center items-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Add Secret
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSecret;