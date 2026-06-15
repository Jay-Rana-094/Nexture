import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../Context/cartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchBoth = async () => {
      try {
        const [productRes, detailsRes] = await Promise.all([
          fetch(`http://localhost:6500/api/products/${id}`),
          fetch(`http://localhost:6500/api/productDetails/${id}`)
        ]);

        const productData = await productRes.json();
        setProduct(productData);

        if (detailsRes.ok) {
          const detailsData = await detailsRes.json();
          setDetails(detailsData);
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to fetch product info:', err);
        setLoading(false);
      }
    };

    fetchBoth();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black text-white">
        <div className="w-12 h-12 border-4 border-neon-purple rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return <p className="text-center mt-10 text-red-600 text-xl">⚠️ Product not found</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-[#0f0f0f] text-white font-sans px-6 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Left: Product Image */}
        <div className="flex justify-center items-center bg-[#111] p-6 rounded-xl border border-neon-blue shadow-xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto max-w-md rounded-xl border border-neon-purple"
          />
        </div>

        {/* Right: Product Data */}
        <div className="bg-[#1a1a1a] p-8 rounded-xl border border-neon-purple/30 shadow-xl space-y-6">
          <h1 className="text-4xl font-bold text-neon-purple">{product.name}</h1>
          <p className="text-2xl text-neon-blue font-bold">₹{product.price}</p>
          <p className="text-gray-400">{product.description}</p>

          {details ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm md:text-base">
              <div className="bg-[#111] p-4 rounded border border-neon-blue">
                <p className="text-neon-purple font-semibold">Category</p>
                <p>{details.category}</p>
              </div>
              <div className="bg-[#111] p-4 rounded border border-neon-purple">
                <p className="text-neon-purple font-semibold">Brand</p>
                <p>{details.brand}</p>
              </div>
              <div className="bg-[#111] p-4 rounded border border-neon-blue">
                <p className="text-neon-purple font-semibold">Specifications</p>
                <p>{details.specifications}</p>
              </div>
              <div className="bg-[#111] p-4 rounded border border-neon-purple">
                <p className="text-neon-purple font-semibold">Features</p>
                <p>{details.features}</p>
              </div>
              <div className="bg-[#111] p-4 rounded border border-neon-blue">
                <p className="text-neon-purple font-semibold">Warranty</p>
                <p>{details.warranty}</p>
              </div>
              <div className="bg-[#111] p-4 rounded border border-neon-purple">
                <p className="text-neon-purple font-semibold">Stock</p>
                <p>{details.stock}</p>
              </div>
              <div className="bg-[#111] p-4 rounded border border-neon-blue">
                <p className="text-neon-purple font-semibold">Rating</p>
                <p>⭐ {details.rating}</p>
              </div>
              <div className="bg-[#111] p-4 rounded border border-neon-purple">
                <p className="text-neon-purple font-semibold">Reviews</p>
                <p>{details.reviews}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 italic mt-4">No detailed specifications available.</p>
          )}

          <button
            onClick={() => addToCart(product)}
            className="mt-8 w-full py-3 rounded-full bg-neon-purple hover:bg-neon-blue text-black font-bold shadow-md transition-all hover:scale-105 tracking-wide"
          >
            🛒 Add to Arsenal
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
