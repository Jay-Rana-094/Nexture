// import React from 'react';
// import { useQuery, gql } from '@apollo/client';

// const GET_GAMES = gql`
//   {
//     games {
//       id
//       title
//       genre
//       platform
//       rating
//       description
//       releaseDate
//     }
//   }
// `;

// const GameSuggestions = () => {
//   const { loading, error, data } = useQuery(GET_GAMES);

//   if (loading) return <p className="text-center mt-10">Loading games...</p>;
//   if (error) return <p className="text-center mt-10 text-red-600">Error loading games.</p>;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
//       <h1 className="text-3xl font-bold text-center text-neon-blue mb-8">🎮 Game Suggestions</h1>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {data.games.map(game => (
//           <div key={game.id} className="bg-[#1a1a1a] p-4 rounded-lg shadow hover:shadow-neon-purple transition">
//             <h2 className="text-xl font-semibold text-neon-purple mb-2">{game.title}</h2>
//             <p className="text-sm text-gray-300 mb-1"><strong>Genre:</strong> {game.genre}</p>
//             <p className="text-sm text-gray-300 mb-1"><strong>Platform:</strong> {game.platform}</p>
//             <p className="text-sm text-gray-300 mb-1"><strong>Rating:</strong> {game.rating}/5</p>
//             <p className="text-sm text-gray-400 mb-2">{game.description}</p>
//             <p className="text-xs text-gray-500">Released: {new Date(game.releaseDate).toLocaleDateString()}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GameSuggestions;
