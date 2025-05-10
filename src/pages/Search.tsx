import React, { useEffect } from 'react';
import { useMovies } from '../contexts/MovieContext';
import MovieGrid from '../components/MovieGrid';
import SearchBar from '../components/SearchBar';
import { Film, Search as SearchIcon } from 'lucide-react';

const Search: React.FC = () => {
  const { movies, searchQuery, isLoading, currentPage, totalPages, loadMoreMovies } = useMovies();
  
  const hasMoreMovies = currentPage < totalPages;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <SearchIcon className="h-8 w-8 mr-2 text-amber-500" />
              Search Movies
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Find exactly what you're looking for
            </p>
          </div>
          <div className="w-full md:max-w-md">
            <SearchBar className="w-full" />
          </div>
        </div>
      </div>

      {searchQuery ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {isLoading && movies.length === 0 
              ? 'Searching...' 
              : `Search results for "${searchQuery}"`}
          </h2>
          <MovieGrid 
            movies={movies} 
            isLoading={isLoading} 
            hasMore={hasMoreMovies} 
            onLoadMore={loadMoreMovies}
            emptyMessage="No movies found. Try a different search term."
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <Film className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
            Enter a movie title in the search bar above to find movies.
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;