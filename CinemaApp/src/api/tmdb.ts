const API_KEY = ""; // Ganti dengan API key TMDB kamu
const BASE_URL = "https://api.themoviedb.org/3";

/**
 * Fungsi untuk mendapatkan daftar film trending.
 * Endpoint: /trending/movie/day
 */
export async function fetchTrendingMovies() {
  try {
    const response = await fetch(
      `${BASE_URL}/trending/movie/day?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Gagal mendapatkan data trending movie");
    }
    const data = await response.json();
    // Mengembalikan array film dari properti 'results'
    return data.results;
  } catch (error) {
    throw error;
  }
}

/**
 * Fungsi untuk mendapatkan daftar popular people (aktor/aktris)
 * Endpoint: /person/popular
 */
export async function fetchPopularPeople() {
  try {
    const response = await fetch(
      `${BASE_URL}/person/popular?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Gagal mendapatkan data popular person");
    }
    const data = await response.json();
    // Mengembalikan array people dari properti 'results'
    return data.results;
  } catch (error) {
    throw error;
  }
}

/**
 * Fungsi untuk mendapatkan daftar New Releases.
 * Kita gunakan endpoint now_playing untuk film yang sedang tayang.
 * Endpoint: /movie/now_playing
 */
export async function fetchNewReleases() {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Gagal mendapatkan data new releases");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    throw error;
  }
}


/**
 * Fetch movie details by ID.
 * Endpoint: /movie/{movie_id}
 */
export async function fetchMovieDetails(movieId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}


/**
 * Fetch similar movies for a given movie.
 * Endpoint: /movie/{movie_id}/similar
 */
export async function fetchSimilarMovies(movieId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch similar movies");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch movie videos by ID.
 * Endpoint: /movie/{movie_id}/videos
 */
export async function fetchMovieVideos(movieId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch movie videos");
    }
    const data = await response.json();
    // Returns an array of video objects (trailers, clips, etc.)
    return data.results;
  } catch (error) {
    throw error;
  }
}

/**
 * Fetch movie credits (cast & crew) by movie ID.
 * Endpoint: /movie/{movie_id}/credits
 */
export async function fetchMovieCredits(movieId: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch movie credits");
    }
    const data = await response.json();
    // data contains both "cast" and "crew" arrays
    return data;
  } catch (error) {
    throw error;
  }
}

export async function searchMovies(searchText: string) {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchText)}`
    );
    if (!response.ok) {
      throw new Error("Failed to search movies");
    }
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
    return [];
  }
}

