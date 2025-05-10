import React, { useRef, useEffect } from 'react';
import { Movie } from '../types/movie';
import MovieCard from './MovieCard';
import { useInView } from 'react-intersection-observer';
import { Loader } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: string;
}

const MovieGrid: React.FC<MovieGridProps> = ({
  movies,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  emptyMessage = 'No movies found',
}) => {
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false,
  });

  // Load more movies when the sentinel comes into view
  useEffect(() => {
    if (inView && hasMore && onLoadMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, onLoadMore, isLoading]);

  if (movies.length === 0 && !isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      
      {/* Loading indicator or sentinel for infinite scroll */}
      {hasMore && (
        <div 
          ref={ref} 
          className="flex justify-center items-center p-4 my-4"
        >
          {isLoading && (
            <div className="flex flex-col items-center">
              <Loader className="animate-spin h-8 w-8 text-amber-500" />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading more movies...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieGrid;