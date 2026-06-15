import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert('Please fill in both Username and Password.');
      return;
    }

    try {
      const res = await fetch('http://localhost:6600/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      localStorage.setItem('userId', data.user._id || data.user.id || '');
      localStorage.setItem('userEmail', data.user.email || '');

      alert('Welcome to Nexture!');
      navigate('/products');
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong. Try again.');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden px-4">
      {/* Particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: '#000' },
          fpsLimit: 36000,
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
            move: { enable: true, speed: 1, outModes: { default: 'bounce' } },
            number: { value: 60 },
            opacity: { value: 0.5 },
            shape: { type: 'circle' },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
        className="absolute top-0 left-0 w-full h-full"
      />

      {/* Login Box */}
      <div className="z-10 w-full max-w-md bg-[#0f0f0f] bg-opacity-90 p-10 rounded-2xl shadow-2xl border-2 border-neon-blue animate-glow">
        <h2 className="text-4xl font-bold mb-8 text-center text-neon-purple tracking-wide">
          Login to <span className="text-neon-blue">Nexture</span>
        </h2>
        <div className="absolute top-6 left-6 z-20 font-pixel text-neon-purple text-sm sm:text-lg">
          Nexture
        </div>
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            onClick={() => window.location.href = 'http://localhost:6600/api/auth/google'}
            className="bg-red-500 text-white px-4 py-2 rounded shadow"
          >
            Sign in with Google
          </button>


          <button
            type="submit"
            className="w-full py-3 bg-neon-blue hover:bg-neon-purple text-black font-semibold rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            Enter the Arena
          </button>
        </form>

        <p className="text-center text-sm mt-6 text-gray-300">
          No account?{' '}
          <Link
            to="/register"
            className="text-neon-blue hover:text-neon-purple transition duration-200"
          >
            Join Now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;