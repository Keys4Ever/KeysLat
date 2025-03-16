import { useEffect } from "react";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import UrlCardSkeleton from "./skeletons/UrlCardSkeleton";
import useTagStore from "../store/useTagsStore";
import useUrlStore from "../store/useUrlStore";

export const Dashboard = () => {
    
    const { auth, loading } = useAuth();
    const navigate = useNavigate();

    const { loading: loadingTags, fetchTags } = useTagStore();
    const { loading: loadingUrls, fetchUrls } = useUrlStore();

    useEffect(() => {
        if(loading) return;

        if(!auth.authenticated){
            navigate('/login')
        }
    }, [loading, auth.authenticated])

    // Fetch Initial Data

    useEffect(() => {
        if(loadingTags) return;
        if(loadingUrls) return;
        fetchTags();
        fetchUrls();
    }, [loadingTags, loadingUrls]);
    
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