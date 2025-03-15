export const ClickableLogo = () => {
    return (
    <a href="https://keys.lat/" className="flex items-center space-x-2 sm:space-x-3 rtl:space-x-reverse focus:outline-none">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8">
            <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>
        </svg>
        
        <span className="self-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold whitespace-nowrap dark:text-white">
            KeysUrl
        </span>
    </a>
    )
}