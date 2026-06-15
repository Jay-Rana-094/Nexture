import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId') || '';
  const userEmail = localStorage.getItem('userEmail') || localStorage.getItem('email') || '';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let res;
        if (userId) {
          res = await fetch(`http://localhost:6500/api/orders/user/${userId}`);
        } else {
          // fallback: fetch all and filter by email
          res = await fetch('http://localhost:6500/api/orders');
        }
        const data = await res.json();
        const my = userId ? data : data.filter(o => (o.email && o.email === userEmail));
        setOrders(my || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId, userEmail]);

  const generateInvoice = (order) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Nexture Invoice', 20, 20);

      doc.setFontSize(11);
      doc.text(`Order ID: ${order._id}`, 20, 34);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 20, 42);
      doc.text(`Status: ${order.status}`, 20, 50);
      doc.text(`Total: ₹${order.total}`, 150, 34);

      const ship = order.shippingAddress || {};
      doc.text('Ship To:', 20, 64);
      doc.text(`${ship.name || ''}`, 20, 72);
      doc.text(`${ship.addressLine1 || ''}`, 20, 80);
      doc.text(`${ship.phone || ''}`, 20, 88);

      doc.text('Items:', 20, 104);
      let y = 112;
      order.items.forEach((it, idx) => {
        doc.text(`${idx + 1}. ${it.name} x${it.quantity} @ ₹${it.price} = ₹${it.price * it.quantity}`, 20, y);
        y += 8;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });

      doc.setFontSize(13);
      doc.text(`Grand Total: ₹${order.total}`, 20, y + 12);
      doc.save(`invoice_${order._id}.pdf`);
    } catch (err) {
      console.error('Failed to generate invoice:', err);
      alert('Unable to generate invoice.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-black to-[#0b0b0b] text-white flex items-center justify-center">
        <div className="text-xl text-neon-purple">⏳ Loading your orders...</div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen p-8 bg-gradient-to-br from-black to-[#0b0b0b] text-white flex flex-col items-center justify-center">
        <div className="text-3xl text-neon-purple mb-4">📦</div>
        <div className="text-xl text-gray-400">No orders found yet.</div>
        <div className="text-sm text-gray-500 mt-2">Start shopping and your orders will appear here!</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-black to-[#0b0b0b] text-white">
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-neon-purple">Your Orders</h2>
        {orders.map(order => (
          <div key={order._id} className="bg-[#111] p-5 rounded-lg border border-neon-blue/20">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-300">Order ID: <span className="text-neon-blue">{order._id}</span></div>
                <div className="text-sm text-gray-400">Placed: {new Date(order.createdAt).toLocaleString()}</div>
                <div className="text-sm text-gray-400">Status: <span className="text-neon-purple">{order.status}</span></div>
              </div>

              <div className="space-y-2 text-right">
                <div className="text-lg font-semibold text-neon-purple">₹{order.total}</div>
                <button
                  onClick={() => generateInvoice(order)}
                  className="px-4 py-2 bg-neon-purple rounded-full text-black font-medium hover:bg-neon-blue"
                >
                  Download Invoice
                </button>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-neon-blue font-semibold">Items</h4>
              <ul className="mt-2 space-y-2 text-gray-300">
                {order.items.map((it, i) => (
                  <li key={i} className="flex justify-between">
                    <div>{it.name} <span className="text-neon-purple">x{it.quantity}</span></div>
                    <div>₹{it.price * it.quantity}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
