import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { ClickableLogo } from "./components/ClickableLogo";
import { AButton } from "../../shared/components/AButton";
import { LoginButton } from "./components/LoginButton";

export const Nav = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const [url, setUrl] = useState<string>(location.pathname);

    useEffect(() => {
        setUrl(location.pathname);
    }, [location]);

    return(
        <nav className="sticky top-0 bg-white dark:bg-black border-b-2 border-black dark:border-white z-50 shadow-sm">
            <div className="flex flex-wrap items-center justify-between px-4 py-3 max-w-[900px] mx-auto">
                <ClickableLogo />

                <div className="flex items-center gap-2 sm:gap-4">
                    {url !== '/' ? (
                        <AButton
                            label="Home" 
                            link="/" 
                            className="text-xs sm:text-sm"
                        />
                    ) : (
                        <AButton
                            link="https://keys4ever.dev"
                            label="About Us"
                            className="text-xs sm:text-sm"
                            external={true}
                        />
                    )}
                    { /**
                     * TODO Add the Avatar menu here
                     */}
                    {auth.authenticated ? ( <span> Is logged in :D </span> ) : ( <LoginButton /> )}
                </div>
            </div>
        </nav>
    )
}