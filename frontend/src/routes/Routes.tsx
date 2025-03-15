import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from '../auth/login/Login';
import { Register } from '../auth/register/Register';
import { PageNotFound } from '../404/404';
import Layout from '../layout/Layout';
import ShortUrl from './ShortUrl';
/*import Layout from '../Layout';
import { Navigate } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import Dashboard from '../pages/Dashboard';
import ShortUrl from './ShortUrl';
import { PageNotFound } from '../pages/404/404';*/
const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Layout>
                <Routes>
                    { /*<Route path="/" element={<Layout><MainPage/></Layout>} />
                    <Route path='/dashboard' element={<Layout><Dashboard /></Layout>} />
                    <Route path='/:shortUrl' element={<ShortUrl />} />
                    <Route path='/auth/login' element={<Navigate to="/" replace />} />
                    <Route path='/callback' element={ <Navigate to="/" replace /> } />
                <Route path='/404' element={<Layout> <PageNotFound/> </Layout>}/>*/}
               
                    {/* Auth routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Not found route */}
                    <Route path="/404" element={<PageNotFound />} />


                </Routes>
            </Layout>
            
            <Route path="/:shortUrl" element={ <ShortUrl /> } />
        </Suspense>
    );
};

export default AppRoutes;
