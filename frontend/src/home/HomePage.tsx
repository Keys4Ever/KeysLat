import HeroSection from "./hero/HeroSection"
import LookURLSection from "./LookForUrl/LookUrlSection"
import QuickShorten from "./QuickShort/QuickShorten"

export const HomePage = () => {
    return (
        <>
            <HeroSection />
            
            <QuickShorten />

            <LookURLSection />
        </>
    )
}