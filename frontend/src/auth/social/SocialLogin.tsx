import { Github } from "lucide-react"
import { AButton } from "../../shared/components/AButton"

export const SocialLogin = () => {
    return (
        <div className="mt-4 w-80 flex justify-center">
                <AButton
                    link={`${import.meta.env.VITE_BACKEND_URI}/auth/github`}
                    label="Login with Github"
                    icon={ <Github color="white" /> }
                />
        </div>
    )
}