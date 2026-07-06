import Navbar from '../components/Navbar';
import Home from '../pages/Home';
import Footer from '../components/Footer';
import RestaurantSchema from '../seo/RestaurantSchema';

function RootLayout() {
    return (
        <>
            <RestaurantSchema />
            <Navbar />
            <main>
                <Home />
            </main>
            <Footer />
        </>
    );
}

export default RootLayout;
