import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getImageUrl } from '../services/tmdbApi';
import { MovieDetail } from '../types/movie';
import { useMovies } from '../contexts/MovieContext';
import { Clock, Star, Calendar, Users, Film, Heart, ArrowLeft, ExternalLink } from 'lucide-react';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || '0', 10);
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToFavorites, removeFromFavorites, isMovieFavorite } = useMovies();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) {
        setError('Invalid movie ID');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getMovieDetails(movieId);
        setMovie(data);
        setIsFavorite(isMovieFavorite(movieId));
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, isMovieFavorite]);

  const handleFavoriteClick = () => {
    if (!movie) return;
    
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
    
    setIsFavorite(!isFavorite);
  };

  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get trailer URL if available
  const getTrailerUrl = (): string | null => {
    if (!movie?.videos?.results.length) return null;
    
    const trailer = movie.videos.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    
    return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
  };

  const trailerUrl = movie ? getTrailerUrl() : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-red-900 bg-opacity-20 p-8 rounded-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error || 'Movie not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Backdrop image with gradient overlay */}
      <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
        <div className="absolute inset-0 bg-black">
          <img
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={movie.title}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center px-3 py-1.5 bg-gray-800 bg-opacity-70 hover:bg-opacity-100 rounded-md text-white text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="w-32 md:w-48 lg:w-64 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl transform transition-transform hover:scale-105">
              <img
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-full h-auto"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  {movie.title}
                </h1>
                <button
                  onClick={handleFavoriteClick}
                  className={`p-2 rounded-full ${
                    isFavorite ? 'bg-red-600' : 'bg-gray-700 hover:bg-red-600'
                  } transition-colors`}
                  aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className="h-6 w-6" fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
              
              <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                {movie.release_date && (
                  <div className="flex items-center text-gray-300">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                )}
                
                {movie.runtime > 0 && (
                  <div className="flex items-center text-gray-300">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
                
                <div className="flex items-center text-gray-300">
                  <Star className="h-4 w-4 mr-1 text-yellow-400" />
                  <span>{movie.vote_average.toFixed(1)} ({movie.vote_count} votes)</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map(genre => (
                  <span key={genre.id} className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Movie details */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-gray-300 mb-8 leading-relaxed">{movie.overview || 'No overview available.'}</p>
            
            {/* Trailer */}
            {trailerUrl && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Film className="h-5 w-5 mr-2 text-amber-500" />
                  Trailer
                </h2>
                <a 
                  href={trailerUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white transition-colors"
                >
                  <ExternalLink className="h-4 w-4 mr-2" /> 
                  Watch on YouTube
                </a>
              </div>
            )}
            
            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-amber-500" />
                  Cast
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {movie.credits.cast.slice(0, 8).map(person => (
                    <div key={person.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-105">
                      <div className="aspect-[2/3] bg-gray-700">
                        <img
                          src={getImageUrl(person.profile_path, 'w185')}
                          alt={person.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/185x278?text=No+Image';
                          }}
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-white truncate">{person.name}</h3>
                        <p className="text-gray-400 text-sm truncate">{person.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div>
            <div className="bg-gray-800 rounded-lg p-6 sticky top-20">
              <h3 className="text-xl font-bold mb-4">Movie Info</h3>
              
              <div className="space-y-4">
                <InfoItem label="Original Title" value={movie.title} />
                <InfoItem label="Release Date" value={new Date(movie.release_date).toLocaleDateString()} />
                <InfoItem label="Rating" value={`${movie.vote_average.toFixed(1)} / 10`} />
                <InfoItem label="Vote Count" value={movie.vote_count.toLocaleString()} />
                {movie.runtime > 0 && (
                  <InfoItem label="Runtime" value={formatRuntime(movie.runtime)} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InfoItemProps {
  label: string;
  value: string | number;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => {
  return (
    <div>
      <h4 className="text-gray-400 text-sm">{label}</h4>
      <p className="text-white">{value}</p>
    </div>
  );
};

export default MovieDetailPage;