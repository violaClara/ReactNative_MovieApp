// usePopularPeople.ts
import { useEffect, useState } from "react";
import { fetchPopularPeople } from "../api/tmdb"; // Sesuaikan path jika diperlukan

export const usePopularPeople = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const people = await fetchPopularPeople();
        setData(people);
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
