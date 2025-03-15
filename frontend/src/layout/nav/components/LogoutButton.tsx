import { useAuth } from "../../../context/AuthContext";

export const LogoutButton = () => {
    const { logout } = useAuth();
    return (
        <button 
            onClick={ logout } 
            className="text-xs sm:text-sm text-white bg-black hover:bg-white hover:text-black border-2 px-3 py-1 sm:px-4 sm:py-2 dark:text-black dark:bg-white dark:hover:bg-black dark:hover:text-white transition-all duration-200"
        >
            Logout
        </button>
    )
}