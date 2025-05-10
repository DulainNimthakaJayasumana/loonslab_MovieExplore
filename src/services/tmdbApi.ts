import axios from 'axios';
import { Movie, MovieDetail, MovieListResponse } from '../types/movie';

// Note: In a real application, you'd want to use environment variables for API keys
// For this demo, we're keeping it simple
const API_KEY = '3fd2be6f0c70a2a598f084ddfb75487c'; // This is a public TMDb API key for demo purposes
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image+Available';
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getTrendingMovies = async (page: number = 1): Promise<MovieListResponse> => {
  try {
    const response = await api.get<MovieListResponse>('/trending/movie/day', {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const searchMovies = async (query: string, page: number = 1): Promise<MovieListResponse> => {
  try {
    const response = await api.get<MovieListResponse>('/search/movie', {
      params: { query, page },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (id: number): Promise<MovieDetail> => {
  try {
    const response = await api.get<MovieDetail>(`/movie/${id}`, {
      params: { append_to_response: 'videos,credits' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<MovieListResponse> => {
  try {
    const response = await api.get<MovieListResponse>('/discover/movie', {
      params: { with_genres: genreId, page },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    throw error;
  }
};

export const getGenres = async () => {
  try {
    const response = await api.get('/genre/movie/list');
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};