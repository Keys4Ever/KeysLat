import { useNavigate } from "react-router-dom"

export const LoginButton = () => {
    const navigate = useNavigate();
    return (
        <button 
            onClick={ () => navigate('/login') } 
            className="text-xs sm:text-sm cursor-pointer text-white bg-black hover:bg-white hover:text-black border-2 px-3 py-1 sm:px-4 sm:py-2 dark:text-black dark:bg-white dark:hover:bg-black dark:hover:text-white transition-all duration-200"
        >
            Login
        </button>
    )
}