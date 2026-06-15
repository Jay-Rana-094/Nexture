import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`http://localhost:6500/api/blogs/${id}`);
        const data = await res.json();

        if (res.ok) {
          setBlog(data);
        } else {
          setError(data.error || '❌ Blog not found');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong');
      }
    };

    fetchBlog();
  }, [id]);

  const GamingLoader = () => (
    <div className="min-h-screen bg-black flex justify-center items-center">
      <div className="relative w-20 h-20 animate-spin-slow">
        <div className="absolute inset-0 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-l-transparent border-r-transparent border-b-neon-purple opacity-90"></div>
        <div className="absolute inset-0 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-l-transparent border-r-transparent border-b-neon-blue opacity-70 animate-ping"></div>
      </div>
    </div>
  );

  if (error) {
    return <div className="text-red-500 text-center py-10 text-lg">{error}</div>;
  }

  if (!blog) {
    return <GamingLoader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-[#121212] text-white p-6">
      <div className="max-w-4xl mx-auto bg-[#1a1a1a] border border-neon-purple/30 shadow-md rounded-xl overflow-hidden">
        <img src={blog.image} alt={blog.title} className="w-full h-96 object-cover border-b border-neon-blue" />

        <div className="p-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-neon-purple mb-3 tracking-wide">
            {blog.title}
          </h1>
          <p className="text-sm text-neon-blue mb-6 italic">
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
          <p className="text-base text-gray-300 mb-4">{blog.summary}</p>
          <p className="text-gray-400 leading-relaxed whitespace-pre-line">
            {blog.content}
          </p>

          <Link
            to="/blogs"
            className="inline-block mt-6 text-neon-blue hover:text-neon-purple font-medium transition"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
