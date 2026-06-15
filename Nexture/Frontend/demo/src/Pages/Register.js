import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch('http://localhost:6600/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name, // use 'name' as username
          email,
          password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Registration failed');
        return;
      }

      alert('🎉 Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      alert('Server error');
    }
  };


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4">
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: '#000',
          },
          fpsLimit: 360,
          interactivity: {
            events: {
              onHover: { enable: true, mode: 'repulse' },
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
            },
          },
          particles: {
            color: { value: ['#00f0ff', '#d000ff'] },
            links: {
              color: '#00f0ff',
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              outModes: { default: 'bounce' },
            },
            number: { value: 60 },
            opacity: { value: 0.5 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* Register Box */}
      <div className="z-10 w-full max-w-md bg-[#0f0f0f] bg-opacity-90 p-10 rounded-2xl shadow-2xl border-2 border-neon-purple animate-glow">
        <h2 className="text-4xl font-bold mb-8 text-center text-neon-purple tracking-wide">
          Create an <span className="text-neon-blue">Account</span>
        </h2>

        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-5 py-3 rounded-lg bg-[#1a1a1a] text-white border border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-blue"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 rounded-lg bg-[#1a1a1a] text-white border border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-blue"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 pr-12 rounded-lg bg-[#1a1a1a] text-white border border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-blue"
              required
            />
            <div
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-neon-blue cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-neon-blue hover:bg-neon-purple text-black font-semibold rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            Register
          </button>
        </form>
        <div className="absolute top-6 left-6 z-20 font-pixel text-neon-purple text-sm sm:text-lg">
          Nexture
        </div>
        <p className="text-center text-sm mt-6 text-gray-300">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-neon-blue hover:text-neon-purple transition duration-200"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
