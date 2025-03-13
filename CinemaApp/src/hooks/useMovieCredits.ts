
// In your custom hooks (e.g., useMovieDetails, useMovieCredits, etc.)
import { useQuery } from '@tanstack/react-query';
import { fetchMovieCredits } from "../api/tmdb"; // Adjust path if needed

export function useMovieCredits(movieId: string) {
  return useQuery({
    queryKey: ["movieCredits", movieId],
    queryFn: () => fetchMovieCredits(movieId)
  });
}
