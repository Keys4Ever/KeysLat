import { Suspense } from 'react';
import { Routes } from 'react-router-dom';
/*import Layout from '../Layout';
import { Navigate } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import Dashboard from '../pages/Dashboard';
import ShortUrl from './ShortUrl';
import { PageNotFound } from '../pages/404/404';*/
const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                { /*<Route path="/" element={<Layout><MainPage/></Layout>} />
                <Route path='/dashboard' element={<Layout><Dashboard /></Layout>} />
                <Route path='/:shortUrl' element={<ShortUrl />} />
                <Route path='/auth/login' element={<Navigate to="/" replace />} />
               	<Route path='/callback' element={ <Navigate to="/" replace /> } />
	    	<Route path='/404' element={<Layout> <PageNotFound/> </Layout>}/>*/}
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
