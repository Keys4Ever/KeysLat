import { FormEvent, useState } from 'react';
import { Plus } from "lucide-react";
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
    const [loading, setLoading] = useState(false);

    const { addSecretUrl, error } = useUrlStore();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        
        if (!secret.trim()) {
            setRes({
                error: true,
                message: 'Please enter a secret'
            });
            return;
        }

        setLoading(true);
        
        try {
            const result = await addSecretUrl(secret.trim());
            
            if (result) {
                setSecret('');
                setRes({
                    error: false,
                    message: 'Secret added successfully'
                });
                
                // Cerrar el modal después de agregar con éxito
                setTimeout(() => {
                    setShowAddSecret(false);
                }, 1000);
            } else {
                throw new Error(error || 'Failed to add secret URL');
            }
        } catch (err: any) {
            setRes({
                error: true,
                message: err.message || 'Failed to add secret URL'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className='fixed inset-0 bg-black opacity-50 flex items-center justify-center z-[101]'></div>
        <div className="fixed inset-0 flex justify-center items-center z-[102]">
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
                        disabled={loading}
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
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={`w-1/2 py-2 bg-white text-black hover:bg-gray-200 transition flex justify-center items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        <Plus className="w-5 h-5" />
                        {loading ? 'Adding...' : 'Add Secret'}
                    </button>
                </div>
            </form>
        </div>
        </>
    );
};

export default AddSecret;