import React, { useContext } from 'react';
import { CartContext } from '../Context/cartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cartItems, increaseQty, decreaseQty, removeFromCart } = useContext(CartContext);
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-[#121212] px-6 py-10 text-white">
      <h2 className="text-4xl font-bold text-center text-neon-purple mb-10 animate-pulse tracking-widest">
        🎒 Your Loadout
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-2xl text-center mt-20 text-gray-400">
          🕳️ Your loadout is empty. Time to stock up.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="bg-[#1a1a1a] border border-neon-blue/30 rounded-xl p-5 shadow-md hover:shadow-neon-purple transition-all duration-300 transform hover:-translate-y-1 relative"
              >
                <img
                  src={
                    item.image ||
                    'https://static.vecteezy.com/system/resources/thumbnails/033/501/763/small/laptop-with-blue-smoke-on-a-black-background-ai-generated-free-photo.jpeg'
                  }
                  alt={item.name}
                  className="w-full h-40 object-contain mb-4 border border-neon-blue rounded"
                />
                <h3 className="text-lg font-bold text-neon-blue mb-1">{item.name}</h3>
                <p className="text-neon-purple font-medium">₹{item.price}</p>
                <p className="text-gray-400 text-sm mb-3">{item.description}</p>

                
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => decreaseQty(item._id)}
                    className="px-3 py-1 rounded-full bg-neon-purple hover:bg-neon-blue text-black font-bold text-lg transition"
                  >
                    -
                  </button>
                  <span className="text-xl font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => increaseQty(item._id)}
                    className="px-3 py-1 rounded-full bg-neon-purple hover:bg-neon-blue text-black font-bold text-lg transition"
                  >
                    +
                  </button>
                </div>

                <p className="mt-2 text-neon-blue font-medium">
                  Subtotal: ₹{item.price * item.quantity}
                </p>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="absolute bottom-4 right-4 bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-xs shadow-lg tracking-wide transition"
                >
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>

          {/* Total and Checkout */}
          <div className="max-w-5xl mx-auto text-right">
            <h3 className="text-3xl font-bold text-neon-purple mb-2">
              💰 Total: ₹{total}
            </h3>
            <Link to="/checkout">
              <button className="mt-4 bg-neon-blue hover:bg-neon-purple text-black font-bold px-8 py-3 rounded-full shadow-lg transition-all hover:scale-105">
                🚀 Deploy Loadout
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
