import React, { useContext, useState } from 'react';
import { CartContext } from '../Context/cartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

   const handleSubmit = async (e) => {
  e.preventDefault();
  if (cartItems.length === 0) {
    alert('Cart is empty!');
    return;
  }

  const orderData = {
      // ensure userId is a 24-char hex string fallback so backend ObjectId casting succeeds
      userId: localStorage.getItem('userId') || '000000000000000000000000',
      userEmail: form.email,
      items: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalPrice,
      shippingAddress: {
        name: form.name,
        addressLine1: form.address,
        phone: form.phone
      },
  };

  try {
    const res = await fetch('http://localhost:6500/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const data = await res.json();

    if (res.ok) {
      console.log('✅ Order placed:', data);
      alert('🚀 Order placed successfully! Confirmation email will arrive shortly.');
      navigate('/products');
    } else {
      console.error('❌ Order failed:', data.error);
      alert(`❌ Order failed: ${data.error}`);
    }
  } catch (error) {
    console.error('❌ Order placement error:', error);
    alert('❌ Failed to place order.');
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-[#121212] p-8 text-white font-sans">
      <div className="max-w-5xl mx-auto bg-[#1a1a1a] border border-neon-blue/20 shadow-2xl rounded-xl p-8">
        <h2 className="text-4xl font-bold text-neon-purple mb-8 text-center tracking-wider animate-pulse">
          💳 Finalize Your Loadout
        </h2>

        {/* Cart Summary */}
        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-neon-blue mb-4">📦 Gear Summary</h3>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Loadout is empty. Gear up first!</p>
          ) : (
            <ul className="space-y-3 text-sm md:text-base">
              {cartItems.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between border-b border-neon-purple/30 pb-2 text-gray-300"
                >
                  <span>
                    {item.name} <span className="text-neon-purple">x{item.quantity}</span>
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
              <li className="flex justify-between font-bold text-lg text-neon-purple mt-4">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </li>
            </ul>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <h3 className="text-2xl font-semibold text-neon-blue mb-2">📫 Delivery Intel</h3>

          <input
            type="text"
            name="name"
            placeholder="Commander Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#111] border border-neon-blue text-white focus:ring-2 focus:ring-neon-purple outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="Email ID"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#111] border border-neon-blue text-white focus:ring-2 focus:ring-neon-purple outline-none"
          />

          <input
            type="text"
            name="address"
            placeholder="Base Address"
            value={form.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#111] border border-neon-blue text-white focus:ring-2 focus:ring-neon-purple outline-none"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Contact Frequency"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-[#111] border border-neon-blue text-white focus:ring-2 focus:ring-neon-purple outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-neon-purple hover:bg-neon-blue text-black font-bold tracking-wider shadow-xl transition-all hover:scale-105"
          >
            🚀 Deploy Loadout
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
