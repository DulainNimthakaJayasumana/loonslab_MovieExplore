import { Movie } from '../types/movie';

// Keys for local storage
const FAVORITES_KEY = 'movie-explorer-favorites';
const THEME_KEY = 'movie-explorer-theme';
const LAST_SEARCH_KEY = 'movie-explorer-last-search';
const USER_KEY = 'movie-explorer-user';

// Favorites management
export const getFavorites = (): Movie[] => {
  const favorites = localStorage.getItem(FAVORITES_KEY);
  return favorites ? JSON.parse(favorites) : [];
};

export const addFavorite = (movie: Movie): void => {
  const favorites = getFavorites();
  if (!favorites.some(fav => fav.id === movie.id)) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites, movie]));
  }
};

export const removeFavorite = (movieId: number): void => {
  const favorites = getFavorites();
  localStorage.setItem(
    FAVORITES_KEY,
    JSON.stringify(favorites.filter(movie => movie.id !== movieId))
  );
};

export const isMovieFavorite = (movieId: number): boolean => {
  const favorites = getFavorites();
  return favorites.some(movie => movie.id === movieId);
};

// Theme management
export const getStoredTheme = (): 'light' | 'dark' | null => {
  return localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
};

export const setStoredTheme = (theme: 'light' | 'dark'): void => {
  localStorage.setItem(THEME_KEY, theme);
};

// Last search management
export const getLastSearch = (): string | null => {
  return localStorage.getItem(LAST_SEARCH_KEY);
};

export const setLastSearch = (query: string): void => {
  localStorage.setItem(LAST_SEARCH_KEY, query);
};

// User management
export const getStoredUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: { username: string }) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeStoredUser = () => {
  localStorage.removeItem(USER_KEY);
};