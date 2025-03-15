import { ArrowLeft } from "lucide-react"
import { AButton } from "../shared/components/AButton"

export const PageNotFound = () =>{
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <img src="/tehe.gif" alt="404"/>
            <h1>Error 404</h1>
            <h2>Page not found</h2>
            <AButton link="/" icon={<ArrowLeft/>} label="Go back home"/>
        </div>
    )
}