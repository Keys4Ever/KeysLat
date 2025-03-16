import { useEffect } from "react";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import useTags from "../hooks/useTags";
import { useUrls } from "../hooks/useUrls";
import UrlCardSkeleton from "./skeletons/UrlCardSkeleton";

export const Dashboard = () => {
    
    const { auth, loading } = useAuth();
    const navigate = useNavigate();
    const { tags, loading: loadingTags } = useTags();
    const { urls, loading: loadingUrls } = useUrls();

    useEffect(() => {
        if(!loading) return;

        if(!auth.authenticated){
            navigate('/login')
        }

    }, [loading, auth.authenticated])

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-[900px] mx-auto">
                <section className="py-8">
                    <div className="space-y-2">
                        { loadingUrls ? <UrlCardSkeleton/> : <UrlCardSkeleton/>}
                    </div>
                </section>
            </div>
        </div>
    )
}