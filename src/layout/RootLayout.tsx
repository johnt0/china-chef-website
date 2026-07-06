import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Footer from '../components/Footer';

function RootLayout() {
    return (
        <>
            <Navbar />
            <main>
                <Home />
            </main>
            <Footer />
        </>
    );
}

export default RootLayout;
