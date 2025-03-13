// useNewReleases.ts
import { useEffect, useState } from "react";
import { fetchNewReleases } from "../api/tmdb"; // Sesuaikan path jika diperlukan

export const useNewReleases = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const releases = await fetchNewReleases();
        setData(releases);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, []);

  return { data, isLoading, error };
};
