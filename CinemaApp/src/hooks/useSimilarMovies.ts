// useSimilarMovies.ts
import { useEffect, useState } from "react";
import { fetchSimilarMovies } from "../api/tmdb"; // Adjust the path if needed

export const useSimilarMovies = (movieId: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getSimilar = async () => {
      try {
        setIsLoading(true);
        const similar = await fetchSimilarMovies(movieId);
        setData(similar);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      getSimilar();
    }
  }, [movieId]);

  return { data, isLoading, error };
};
