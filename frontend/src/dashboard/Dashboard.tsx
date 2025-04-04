import { useEffect } from "react";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";
import UrlCardSkeleton from "./skeletons/UrlCardSkeleton";
import useTagStore from "../store/useTagsStore";
import useUrlStore from "../store/useUrlStore";
import UrlCard from "./url/UrlCard";
import SearchAndActionBar from "./search/SearchAndActionBar";
import TagsSection from "./tag/TagSection";

export const Dashboard = () => {
    
    const { auth, loading } = useAuth();
    const navigate = useNavigate();

    const { loading: loadingTags, fetchTags } = useTagStore();
    const { loading: loadingUrls, fetchUrls, filteredUrls: urls } = useUrlStore();


    useEffect(() => {
        if(loading) return;

        if(!auth.authenticated){
            navigate('/login')
        }
    }, [loading, auth.authenticated])

    // Fetch Initial Data

    useEffect(() => {
        if (!loadingTags) fetchTags();
        if (!loadingUrls) fetchUrls();
    }, []);
    
    if (loadingTags) {
        return (
          <div className="min-h-screen bg-black text-white">
            <div className="max-w-[900px] mx-auto">
              <section className="py-8">
                <UrlCardSkeleton />
              </section>
            </div>
          </div>
        );
      }
    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-[900px] mx-auto">
                <section className="py-8">
                    <div className="space-y-2">
                        <TagsSection />
                        <SearchAndActionBar />
                        {loadingUrls ? (
                            <UrlCardSkeleton />
                        ) : Array.isArray(urls) && urls.length > 0 ? (
                            console.log('urls: ',urls),
                            urls.map((url) => <UrlCard key={url.id} item={url} />)
                        ) : (
                            'No urls found'
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}