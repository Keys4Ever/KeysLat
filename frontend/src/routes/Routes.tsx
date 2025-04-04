import { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Login } from '../auth/login/Login';
import { Register } from '../auth/register/Register';
import { PageNotFound } from '../404/404';
import Layout from '../layout/Layout';
import ShortUrl from './ShortUrl';
import { HomePage } from '../home/HomePage';
import { Dashboard } from '../dashboard/Dashboard';

const AppRoutes = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Layout>
                <Routes>
                    <Route path='/dashboard' element={<Dashboard />} />
                    <Route path='/:shortUrl' element={<ShortUrl />} />
                    <Route path='/callback' element={ <Navigate to="/" replace /> } />
                    <Route path='/404' element={<PageNotFound/>}/>
               
                    {/* Auth routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Home page */}
                    <Route path='/' element={<HomePage />} />
                </Routes>
            </Layout>
            
        </Suspense>
    );
};

export default AppRoutes;
