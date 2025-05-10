// src/pages/Home.tsx

import React from 'react';
import { Film, TrendingUp as Trending } from 'lucide-react';
import { useMovies } from '../contexts/MovieContext';
import MovieGrid from '../components/MovieGrid';

const Home: React.FC = () => {
  const { trendingMovies, isLoading } = useMovies();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center mb-2">
          <Film className="h-8 w-8 mr-2 text-amber-500" />
          Movie Explorer
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Discover your next favorite movie
        </p>
      </div>

      {/* Trending Section */}
      <section className="mb-12">
        <div className="flex items-center mb-4">
          <Trending className="h-6 w-6 mr-2 text-amber-500" />
          <h2 className="text-xl font-bold">Trending Movies</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500" />
          </div>
        ) : (
          <MovieGrid movies={trendingMovies} />
        )}
      </section>
    </div>
  );
};

export default Home;