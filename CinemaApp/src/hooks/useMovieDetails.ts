// useMovieDetails.ts
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../api/tmdb"; // Adjust path if needed

export const useMovieDetails = (movieId: string) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const details = await fetchMovieDetails(movieId);
        setData(details);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (movieId) {
      getData();
    }
  }, [movieId]);

  return { data, isLoading, error };
};
