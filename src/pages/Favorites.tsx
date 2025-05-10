import React from 'react';
import { Heart, AlertCircle } from 'lucide-react';
import { useMovies } from '../contexts/MovieContext';
import MovieGrid from '../components/MovieGrid';
import { Link } from 'react-router-dom';

const Favorites: React.FC = () => {
  const { favoriteMovies } = useMovies();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Heart className="h-8 w-8 mr-2 text-red-500" />
          Your Favorites
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {favoriteMovies.length > 0 
            ? `You have ${favoriteMovies.length} favorite ${favoriteMovies.length === 1 ? 'movie' : 'movies'}` 
            : 'Your collection of favorite movies'}
        </p>
      </div>

      {favoriteMovies.length > 0 ? (
        <MovieGrid movies={favoriteMovies} />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md">
            <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
            <p className="text-gray-400 mb-6">
              You haven't added any movies to your favorites. Explore movies and click the heart icon to add them here.
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-md text-white transition-colors"
            >
              Explore Movies
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;