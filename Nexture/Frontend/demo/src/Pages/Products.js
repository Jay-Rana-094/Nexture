import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../Context/cartContext';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import Tilt from 'react-parallax-tilt';

const Products = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState(50000);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:6500/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(' Failed to fetch products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const loadMoreProducts = () => {
    const currentLength = visibleProducts.length;
    const more = filteredProducts.slice(currentLength, currentLength + 8);
    if (more.length === 0) {
      setHasMore(false);
    } else {
      setVisibleProducts([...visibleProducts, ...more]);
    }
  };

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // compute filtered products from full products list
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!selectedCategory || product.category === selectedCategory) &&
    product.price <= maxPrice
  );

  // reset visible products when filters or product list change
  useEffect(() => {
    setVisibleProducts(filteredProducts.slice(0, 8));
    setHasMore(filteredProducts.length > 8);
  }, [products, selectedCategory, searchQuery, maxPrice]);


  const GamingLoader = ({ mini = false }) => (
  <div className={`flex ${mini ? 'mt-10' : 'min-h-screen'} justify-center items-center bg-black`}>
    <div className="relative w-20 h-20 animate-spin-slow items-center">
      <div className="absolute inset-0 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-l-transparent border-r-transparent border-b-neon-purple opacity-90"></div>
      <div className="absolute inset-0 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-l-transparent border-r-transparent border-b-neon-blue opacity-70 animate-ping"></div>
    </div>
  </div>
);
if (!products.length) return <GamingLoader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-[#121212] text-white px-6 py-10 font-sans">
    
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-neon-purple animate-pulse">
          🕹️ Gear Up, Warrior!
        </h2>

        <input
          type="text"
          placeholder="Search tech gear..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-5 py-2 w-full sm:w-60 rounded-full bg-[#1a1a1a] text-white border border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-blue"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-5 py-2 w-full sm:w-48 rounded-full bg-[#1a1a1a] border border-neon-purple text-white"
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="text-sm text-gray-400">
          Max ₹{maxPrice.toLocaleString()}
          <input
            type="range"
            min="0"
            max="100000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="ml-4 accent-neon-blue"
          />
        </div>
      </div>

    
      <InfiniteScroll
        dataLength={visibleProducts.length}
        next={loadMoreProducts}
        hasMore={hasMore}
        loader={<GamingLoader mini />}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10"
      >
        {visibleProducts.map((product) => (
          <Tilt
            key={product._id}
            tiltMaxAngleX={10}
            tiltMaxAngleY={10}
            glareEnable={true}
            glareColor="#d000ff"
            className="transition-transform"
          >
            <div className="bg-[#1a1a1a] border border-neon-blue/30 rounded-xl p-5 shadow-md hover:shadow-neon-purple transition-all duration-300 transform hover:-translate-y-1">
              <Link to={`/products/${product._id}`} className="block mb-4">
              <img src={product.image} alt={product.name} className="w-full h-40 object-contain rounded-lg border border-neon-blue mb-3"/>
                <h3 className="text-lg font-semibold text-neon-blue">{product.name}</h3>
                <p className="text-neon-purple font-bold mt-1">₹{product.price}</p>
                <p className="text-gray-400 text-sm mt-1">{product.description}</p>
              </Link>
              <button
                onClick={() => addToCart(product)}
                className="w-full mt-3 py-2 rounded-full bg-neon-purple hover:bg-neon-blue text-black font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              >
                + Add to Loadout
              </button>
            </div>
          </Tilt>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Products;
