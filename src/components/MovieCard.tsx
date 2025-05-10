import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, Calendar } from 'lucide-react';
import { Movie } from '../types/movie';
import { getImageUrl } from '../services/tmdbApi';
import { useMovies } from '../contexts/MovieContext';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className = '' }) => {
  const { id, title, poster_path, vote_average, release_date } = movie;
  const { addToFavorites, removeFromFavorites, isMovieFavorite } = useMovies();
  const [isFavorite, setIsFavorite] = useState(isMovieFavorite(id));
  const [isHovered, setIsHovered] = useState(false);

  const releaseYear = release_date ? new Date(release_date).getFullYear() : 'Unknown';
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling
    
    if (isFavorite) {
      removeFromFavorites(id);
    } else {
      addToFavorites(movie);
    }
    
    setIsFavorite(!isFavorite);
  };

  return (
    <div 
      className={`relative group overflow-hidden rounded-lg shadow-md bg-gray-800 transition-all duration-300 hover:shadow-xl h-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/movie/${id}`} className="block h-full">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={getImageUrl(poster_path)}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-${isHovered ? '80' : '50'} transition-opacity duration-300`}></div>
          
          {/* Rating */}
          <div className="absolute top-2 left-2 flex items-center bg-black bg-opacity-70 rounded-full px-2 py-1 text-xs">
            <Star className="h-3 w-3 text-yellow-400 mr-1" />
            <span>{vote_average.toFixed(1)}</span>
          </div>
          
          {/* Favorite button */}
          <button
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors duration-300 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-black bg-opacity-70 text-white hover:bg-red-500'
            }`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <div className="p-3">
          <h3 className="font-bold text-white truncate">{title}</h3>
          <div className="flex items-center mt-1 text-gray-400 text-sm">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{releaseYear}</span>
          </div>
        </div>
        
        {/* Hover overlay with more details */}
        <div className={`absolute inset-0 p-4 bg-black bg-opacity-85 text-white flex flex-col justify-end transform ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <h3 className="font-bold text-lg mb-2">{title}</h3>
          <p className="text-gray-300 text-sm line-clamp-3">{movie.overview || 'No overview available.'}</p>
          <div className="mt-3 text-amber-400 text-sm font-semibold">Click for details</div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;