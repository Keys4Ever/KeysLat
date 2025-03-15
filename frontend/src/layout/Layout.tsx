import AuthProvider from '../context/AuthContext.js';
import { Footer } from './footer/Footer.js';
import { Nav } from './nav/Nav.js';

interface LayoutProps{
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    return (
        <AuthProvider>
            <Nav />
            <main className='bg-white dark:bg-black text-black dark:text-white'>{children}</main>
            <Footer />
        </AuthProvider>
    );
};

export default Layout;