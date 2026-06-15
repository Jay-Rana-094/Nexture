import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { FaMoon, FaSun } from 'react-icons/fa';

const Home = () => {
  const [darkMode, setDarkMode] = useState(true);

  // useEffect(() => {
  //   document.documentElement.classList.toggle('dark', darkMode);
  // }, [darkMode]);

  return (
    
    <div className="min-h-screen flex flex-col items-center justify-center px-6 transition-all duration-500 bg-gradient-to-br dark:from-black dark:to-gray-900 from-purple-100 via-white to-blue-100 text-center">

    
      {/* <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xl text-neon-purple dark:text-neon-blue hover:scale-110 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
      </div> */}

      {/* Pixel Logo */}
      <div className="absolute top-6 left-6 z-20 font-pixel text-neon-purple text-sm sm:text-lg">
        Nexture
      </div>

      {/* Main Content */}
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg dark:text-neon-purple text-purple-700 animate-pulse">
        Welcome to <span className="text-blue-600 dark:text-neon-blue">Nexture</span>
      </h1>

      <p className="text-lg md:text-xl max-w-2xl mb-10 text-gray-700 dark:text-gray-300">
        Discover the latest tech products — laptops, headphones, gaming accessories, and smart devices. Explore reviews, specs, price comparisons, and tech news — all in one place.
      </p>

      <Link to="/login">
        <button className="px-8 py-3 font-semibold bg-neon-blue text-black dark:text-white rounded-full shadow-lg hover:bg-neon-purple hover:scale-105 transition transform duration-300">
          Shop Now
        </button>
      </Link>
    </div>
  );
};

export default Home;
