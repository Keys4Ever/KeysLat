import { JSX } from "react";
import { useNavigate } from "react-router-dom";

interface OptionProps {
    icon: JSX.Element;
    label: string;
    moveTo?: string;
    hasBorder?: boolean;
    isExternal?: boolean;
    action?: () => void;
    className?: string;
}

const Option = ({ icon, label, moveTo, hasBorder = false, isExternal = false, action, className }: OptionProps) => {
    const navigate = useNavigate();

    const handleClick = () => {

        if(action) action();

        if(!moveTo) return;
        if (isExternal) {
            window.location.href = moveTo;
        } else {
            navigate(moveTo);
        }
    };

    return (
        <li className={`${className}`}>
            <a
                onClick={handleClick}
                className={`
                    flex items-center gap-2 px-3 sm:px-4 
                    hover:cursor-pointer py-2 
                    text-xs sm:text-sm 
                    text-black bg-white 
                    hover:bg-black hover:text-white 
                    dark:bg-black dark:text-white 
                    dark:hover:bg-white dark:hover:text-black 
                    transition-all duration-200 
                    ${hasBorder ? 'border-b border-black dark:border-white' : ''}
                `}
            >
                <span className="mr-2">
                    {icon}
                </span>
                <span className="truncate">{label}</span>
            </a>
        </li>
    );
};

export default Option;