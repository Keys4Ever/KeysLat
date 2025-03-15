import { useState } from 'react';
import { User, X } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import OptionList from './options/OptionList';
const ImageDropMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { auth } = useAuth();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Desktop Dropdown */}
            <div className="relative z-50 hidden sm:block">
                <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 bg-black text-white border-2 border-white hover:bg-white hover:text-black focus:outline-none transition-colors duration-200"
                    onClick={toggleDropdown}
                >
                    <span className="sr-only">Open user menu</span>
                    {auth?.data?.profile_picture ? 
                        <img 
                            src={auth.data.profile_picture} 
                            alt="User profile" 
                            className='w-10 object-cover'
                        /> : 
                        <User className='w-5 h-5' />
                    }
                </button>
                
                {isOpen && (
                    <div
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-black text-black dark:text-white border-2 border-black dark:border-white shadow-lg font-mono"
                    >
                        <div className="px-4 py-3 border-b-2 border-white text-center">
                            <span className="block text-sm font-bold">{auth.data?.username || 'Usuario'}</span>
                            <span className="block text-xs text-gray-400">{auth.data?.email || 'No hay email'}</span>
                        </div>
                        <OptionList />
                    </div>
                )}
            </div>

            {/* Mobile Full-Screen Slide-Out Menu */}
            <div className="block sm:hidden">
                <button
                    type="button"
                    className="flex items-center justify-center w-10 h-10 bg-black text-white border-2 border-white hover:bg-white hover:text-black focus:outline-none transition-colors duration-200"
                    onClick={toggleDropdown}
                >
                    <span className="sr-only">Open user menu</span>
                    {auth?.data?.profile_picture ? 
                        <img 
                            src={auth.data?.profile_picture} 
                            alt="User profile" 
                            className='w-10 object-cover'
                        /> : 
                        <User className='w- 5 h-5' />
                    }
                </button>

                {isOpen && (
                    <div 
                        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
                        onClick={toggleDropdown}
                    >
                        <div 
                            className="fixed top-0 right-0 w-64 h-full bg-white dark:bg-black text-black dark:text-white shadow-lg transform transition-transform duration-300 ease-in-out"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center p-4 border-b-2 border-black dark:border-white">
                                <div>
                                    <span className="block text-sm font-bold">{auth.data?.username || 'Usuario'}</span>
                                    <span className="block text-xs text-gray-400">{auth.data?.email || 'No hay email'}</span>
                                </div>
                                <button 
                                    onClick={toggleDropdown} 
                                    className="text-black dark:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <OptionList toggleDropdown={toggleDropdown} isMobile />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ImageDropMenu;