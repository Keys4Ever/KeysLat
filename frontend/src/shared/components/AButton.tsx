import { JSX } from "react";
import { useNavigate } from "react-router-dom";

export interface AButtonProps {
    label?: string;
    external?: boolean;
    link: string;
    isInverted?: boolean;
    icon?: JSX.Element;
    place?: 'left' | 'right';
    className?: string;
}

export const AButton = ( { label, external, link, isInverted, icon, place = 'left', className }: AButtonProps ) => {
    const navigate = useNavigate();
    return (
        <a 
            onClick={() => external ? window.location.href = link : navigate(link)}
            className={`flex items-center gap-2 hover:cursor-pointer border-2 px-4 py-2 ${ isInverted ? 'text-white bg-black hover:bg-white hover:text-black dark:text-black dark:bg-white dark:hover:bg-black dark:hover:text-white' : 'text-black border-black hover:bg-black hover:text-white dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black' } transition-all duration-200`}
        >

            { icon && place === "left" && <span className="w-5 h-5 flex items-center justify-center">{ icon }</span>}
            <span className={"font-bold text-sm leading-none " + className}>{ label }</span>
            { icon && place === "right" && <span className="w-5 h-5 flex items-center justify-center">{ icon }</span>}

        </a>
    )
}