import { LayoutDashboard, LogOut } from 'lucide-react';
import Option from './Option.jsx';

interface OptionListProps {
    toggleDropdown?: () => void;
    isMobile?: boolean;
}

const OptionList = ({toggleDropdown, isMobile}: OptionListProps) => {
    return (
        <ul 
            aria-labelledby="user-menu-button" 
            className="flex flex-col w-full max-w-xs bg-white dark:bg-black"
        >
            <Option 
                icon={<LayoutDashboard className="w-5 h-5 sm:w-6 sm:h-6" />} 
                label="Dashboard"
                moveTo="/dashboard"
                action={toggleDropdown}
                hasBorder={true}
            />
            <Option
                icon={<LogOut className="w-5 h-5 sm:w-6 sm:h-6" />} 
                label="Logout" 
                className={isMobile ? 'border-b-2 border-white' : ''}
                moveTo={`${import.meta.env.VITE_BACKEND_URL}logout`}
                action={toggleDropdown}
                isExternal
            />
        </ul>
    );
};

export default OptionList;