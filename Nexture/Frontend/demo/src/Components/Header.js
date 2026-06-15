import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../Context/cartContext';
import { FaShoppingCart } from 'react-icons/fa';
import { isLoggedIn, getUsername, logout } from '../utils/auth';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  return (
    <header className="bg-[#0f0f0f] text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl sm:text-2xl font-pixel text-neon-purple">
          Nexture
        </Link>

        <nav className="space-x-6 text-sm sm:text-base">
          <Link to="/products" className="hover:text-neon-blue transition">Products</Link>
          {/* <Link to="/games" className="hover:text-neon-blue transition">Games</Link> */}
          <Link to="/blogs" className="hover:text-neon-blue transition">Blogs</Link>

          {isLoggedIn() ? (
            <>
              <Link to="/my-orders" className="hover:text-neon-blue transition">My Orders</Link>
              <span className="text-neon-blue">{getUsername()}</span>
              <button onClick={handleLogout} className="hover:text-red-400 transition">Logout</button>
            </>
          ) : (
            <Link to="/login" className="hover:text-neon-blue transition">Login</Link>
          )}

          <Link to="/cart" className="relative inline-flex items-center hover:text-neon-purple transition">
            <FaShoppingCart className="text-lg" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-neon-purple text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
