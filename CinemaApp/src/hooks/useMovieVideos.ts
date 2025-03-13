import { useEffect, useState } from "react";
import { fetchMovieVideos } from "../api/tmdb"; // adjust the path as needed

export function useMovieVideos(movieId: string) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchMovieVideos(movieId)
      .then((videos) => {
        setData(videos);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
        setIsLoading(false);
      });
  }, [movieId]);

  return { data, isLoading, error };
}
