import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Movie, MovieListResponse } from '../types/movie';
import { getTrendingMovies, searchMovies } from '../services/tmdbApi';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
  getLastSearch,
  setLastSearch,
} from '../services/localStorage';

interface MovieContextType {
  movies: Movie[];
  trendingMovies: Movie[];
  favoriteMovies: Movie[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setSearchQuery: (query: string) => void;
  searchForMovies: (query: string, page?: number) => Promise<void>;
  loadMoreMovies: () => Promise<void>;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isMovieFavorite: (movieId: number) => boolean;
  resetSearch: () => void;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  /* ─────────────────  bootstrap  ───────────────── */
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await getTrendingMovies();
        setTrendingMovies(res.results);
      } catch {
        setError('Failed to load trending movies');
      } finally {
        setIsLoading(false);
      }
    })();

    setFavoriteMovies(getFavorites());

    // restore last search silently
    (async () => {
      const last = getLastSearch();
      if (!last) return;
      setSearchQuery(last);
      try {
        await searchForMovies(last);
      } catch {
        /* swallow – offline etc. */
      }
    })();
  }, []);

  /* ─────────────────  actions  ───────────────── */
  const searchForMovies = async (query: string, page = 1) => {
    if (!query.trim()) {
      resetSearch();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const res = await searchMovies(query, page);

      setMovies((prev) => (page === 1 ? res.results : [...prev, ...res.results]));
      setCurrentPage(page);                    // ✅ always reflects real page
      setTotalPages(res.total_pages);
      setSearchQuery(query);
      if (page === 1) setLastSearch(query);    // only persist initial query
    } catch {
      setError('Failed to search movies');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMovies = async () => {
    if (isLoading || currentPage >= totalPages) return;
    await searchForMovies(searchQuery, currentPage + 1);
  };

  const addToFavorites = (movie: Movie) => {
    addFavorite(movie);
    setFavoriteMovies((prev) => [...prev, movie]);
  };

  const removeFromFavorites = (id: number) => {
    removeFavorite(id);
    setFavoriteMovies((prev) => prev.filter((m) => m.id !== id));
  };

  const isMovieFavorite = (id: number) =>
    favoriteMovies.some((m) => m.id === id);

  const resetSearch = () => {
    setMovies([]);
    setSearchQuery('');
    setCurrentPage(1);
    setTotalPages(0);
  };

  /* ─────────────────  expose  ───────────────── */
  return (
    <MovieContext.Provider
      value={{
        movies,
        trendingMovies,
        favoriteMovies,
        searchQuery,
        isLoading,
        error,
        currentPage,
        totalPages,
        setSearchQuery,
        searchForMovies,
        loadMoreMovies,
        addToFavorites,
        removeFromFavorites,
        isMovieFavorite,
        resetSearch,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => {
  const ctx = useContext(MovieContext);
  if (!ctx) throw new Error('useMovies must be used within a MovieProvider');
  return ctx;
};