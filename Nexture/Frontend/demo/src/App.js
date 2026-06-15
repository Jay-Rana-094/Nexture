import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './Components/Header';
import Footer from './Components/Footer';
import Loader from './Components/Loader';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Cart from './Pages/Cart';
import Home from './Pages/Home';
import Blogs from './Pages/Blog';
import BlogDetails from './Pages/blogDetails';
import ProductDetails from './Pages/productDetails';
import Products from './Pages/Products';
import Checkout from './Pages/checkout';
import GameSuggestions from './Pages/GameSuggestions';
import MyOrders from './Pages/MyOrders';




function LayoutWrapper() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const hideHeaderPaths = ['/', '/login', '/register'];
  const hideFooterPaths = ['/login', '/register'];
  const excludeDarkModePages = ['/checkout', '/cart', '/login', '/register', '/products', '/blogs', '/blogsDetails', '/games', '/productdetails', '/my-orders'];

  const hideHeader = hideHeaderPaths.includes(location.pathname);
  const hideFooter = hideFooterPaths.includes(location.pathname);
  const showDarkModeToggle = !excludeDarkModePages.includes(location.pathname);

  // show loader on route transitions except on login page
  useEffect(() => {
    if (location.pathname === '/login') {
      setLoading(false);
      return;
    }
    // show loader briefly to indicate transition
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen transition duration-500">
      {loading && location.pathname !== '/login' && <Loader />}
      {!hideHeader && <Header />}
      {showDarkModeToggle && (
        <div className="fixed top-6 right-6 z-50">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xl text-neon-purple dark:text-neon-blue hover:scale-110 transition"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      )}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/games" element={<GameSuggestions />} />
          </Routes>
        </AnimatePresence>
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <LayoutWrapper />
    </Router>
  );
}

export default App;
