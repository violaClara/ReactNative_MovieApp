// useMovie.ts
import { useEffect, useState } from "react";
import { fetchTrendingMovies } from "../api/tmdb"; // Pastikan path sudah sesuai

export const useMovie = (query: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        let result: any[] = [];
        if (query === "trending") {
          const trendingMovies = await fetchTrendingMovies();
          // Ambil hanya 5 film pertama untuk carousel
          result = Array.isArray(trendingMovies) ? trendingMovies.slice(0, 5) : [];
        } else {
          result = [];
        }
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [query]);

  return { data, isLoading, error };
};
