import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch('http://localhost:6500/api/blogs');
        const data = await res.json();

        if (Array.isArray(data)) {
          setBlogs(data.reverse());
        } else {
          setError('No blog data received.');
        }
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        setError('Failed to load blogs.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const GamingLoader = () => (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <div className="relative w-20 h-20 animate-spin-slow">
        <div className="absolute inset-0 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-l-transparent border-r-transparent border-b-neon-purple opacity-90"></div>
        <div className="absolute inset-0 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-l-transparent border-r-transparent border-b-neon-blue opacity-70 animate-ping"></div>
      </div>
    </div>
  );

  if (loading) return <GamingLoader />;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="min-h-screen px-6 py-10 bg-gradient-to-br from-black via-[#0f0f0f] to-[#121212] text-white font-sans">
      <h1 className="text-4xl sm:text-5xl font-bold text-center text-neon-purple mb-10 animate-pulse tracking-wider">
        📝 Latest Tech Chronicles
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="bg-[#1a1a1a] rounded-xl overflow-hidden border border-neon-purple/30 hover:border-neon-purple shadow-md hover:shadow-neon-blue/30 transition duration-300 transform hover:-translate-y-1 group"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="h-auto w-full object-cover group-hover:brightness-110 transition duration-300"
            />
            <div className="p-5">
              <h2 className="text-xl font-bold text-neon-blue mb-2 group-hover:text-neon-purple transition duration-200">
                {blog.title}
              </h2>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">{blog.summary}</p>
              <Link to={`/blogs/${blog._id}`}>
                <button
                  onClick={() => alert("Redirect to full Blog ?")}
                  className="bg-neon-purple hover:bg-neon-blue text-black font-medium px-4 py-2 rounded-full text-sm transition transform hover:scale-105"
                >
                  📖 Read Full Blog
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blogs;
