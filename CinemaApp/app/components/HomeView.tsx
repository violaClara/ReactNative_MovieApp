// HomeView.tsx
import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { useMovie } from "../../src/hooks/useMovie";
import { usePopularPeople } from "../../src/hooks/usePopularPeople";
import { useNewReleases } from "../../src/hooks/useNewReleases";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import { TextInput } from "react-native";
import { searchMovies } from "../../src/api/tmdb";

const { width } = Dimensions.get("window");

type RootStackParamList = {
  Home: undefined;
  MovieDetails: { movieId: string };
};

// Define a Movie interface to type your movie objects
interface Movie {
  id: number | string;
  poster_path: string;
  release_date: string;
  genres: { name: string }[];
  title: string;
  overview: string;
  vote_average?: number;
}

const HomeView: React.FC = () => {
  // Mengambil data trending (5 film) dari TMDB menggunakan hook useMovie
  const { data: movies, error, isLoading } = useMovie("trending");

  // Data popular people (aktor/aktris) menggunakan usePopularPeople
  const {
    data: popularPeople,
    isLoading: popularLoading,
    error: popularError,
  } = usePopularPeople();

  // Data new releases dari TMDB
  const {
    data: newReleases,
    isLoading: newReleasesLoading,
    error: newReleasesError,
  } = useNewReleases();

  // State untuk menyimpan indeks carousel yang aktif
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Ref for the main ScrollView to allow scrolling to the search bar section
  const mainScrollRef = useRef<ScrollView>(null);

  // To capture the Y position of the search container
  const [searchContainerY, setSearchContainerY] = useState(0);

  // Then type your navigation object:
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Fungsi onScroll untuk update indeks aktif berdasarkan offset horizontal
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };

  // Jika movies belum tersedia, gunakan array kosong sebagai fallback
  const movieList = movies && Array.isArray(movies) ? movies : [];

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);

  // Efek auto slide: setiap 5 detik carousel akan berpindah slide dengan animasi
  useEffect(() => {
    if (movieList.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % movieList.length;
        scrollViewRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });
        return nextIndex;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [movieList.length]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim() !== "") {
        searchMovies(query).then(setResults);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // When the search input is focused, scroll the main ScrollView so that the search bar is at the top
  const handleSearchFocus = () => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ y: searchContainerY, animated: true });
    }
  };

  const handleVoiceSearch = () => {
    // TODO: Implement voice search functionality
    console.log("Voice search triggered");
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <LinearGradient
        colors={["#000", "#000", "#23193C"]}
        style={styles.outerGradient}
      >
        {/* Header Icons (Back and More) */}
        <View style={styles.headerOverlay}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <LinearGradient
            colors={["#00FFFC", "#FF00FF", "#00FFFC"]} // Adjust colors as needed
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.neonBorder}
          >
            <Image
              source={{
                uri: "https://storage.googleapis.com/a1aa/image/DE8c6iJltAvfIUf2ZemPVxQWvouCBxGREfJ9VsbTeSY.jpg",
              }}
              style={styles.profileImage}
            />
          </LinearGradient>
        </View>
        {/* Inner content dengan padding */}
        <View style={styles.innerContent}>
          {/* Carousel Wrapper tanpa padding horizontal agar slide full width terpusat */}
          <View style={styles.carouselWrapper}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
              ref={scrollViewRef}
              contentContainerStyle={{ paddingHorizontal: 0 }}
            >
              {isLoading || error || movieList.length === 0 ? (
                // Tampilan loading jika data belum tersedia
                <View style={styles.carouselItem}>
                  <Image
                    source={{
                      uri: "https://via.placeholder.com/400x600?text=Loading+Poster",
                    }}
                    style={styles.featuredImage}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.98)"]}
                    style={styles.featuredOverlay}
                  />
                  <View style={styles.featuredTextContainer}>
                    <Text style={styles.featuredTitle}>Loading...</Text>
                    <Text style={styles.featuredTagline}>
                      For Binge Watching
                    </Text>
                    <Text style={styles.featuredDescription}>
                      Fetching movie details...
                    </Text>
                  </View>
                </View>
              ) : (
                movieList.map(
                  (
                    movie: {
                      id: string;
                      poster_path: string;
                      release_date: string;
                      genres: { name: string }[];
                      title: string;
                      overview: string;
                    },
                    index
                  ) => {
                    // Buat URL poster menggunakan poster_path
                    const posterUrl = movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://via.placeholder.com/400x600?text=No+Poster";
                    // Ambil tahun dari release_date (YYYY-MM-DD)
                    const releaseYear = movie.release_date
                      ? movie.release_date.slice(0, 4)
                      : "";
                    // Gabungkan genre jika ada
                    let genres = "";
                    if (movie.genres) {
                      if (Array.isArray(movie.genres)) {
                        genres = movie.genres
                          .map((genre: { name: string } | string) =>
                            typeof genre === "string" ? genre : genre.name
                          )
                          .join(", ");
                      } else {
                        genres = movie.genres;
                      }
                    }
                    return (
                      <View key={movie.id || index} style={styles.carouselItem}>
                        <Image
                          source={{ uri: posterUrl }}
                          style={styles.featuredImage}
                          resizeMode="cover"
                        />
                        <LinearGradient
                          colors={["transparent", "rgba(0,0,0,0.98)"]}
                          style={styles.featuredOverlay}
                        />
                        <View style={styles.featuredTextContainer}>
                          <Text style={styles.featuredTitle}>
                            {movie.title || "No Title"}
                          </Text>
                          <Text style={styles.featuredTagline}>
                            For Binge Watching
                          </Text>
                          <Text style={styles.featuredDescription}>
                            {movie.overview || "No description available."}
                          </Text>
                          <Text style={styles.movieInfo}>
                            {genres} {releaseYear}
                          </Text>
                        </View>
                      </View>
                    );
                  }
                )
              )}
            </ScrollView>
            {/* Pagination Dots */}
            <View style={styles.dotsContainer}>
              {movieList.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        activeIndex === index ? "#fff" : "#9CA3AF",
                    },
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Search Bar Section */}
          <View
            style={styles.searchContainer}
            onLayout={(event) =>
              setSearchContainerY(event.nativeEvent.layout.y)
            }
          >
            <View style={styles.searchBar}>
              <FontAwesome
                name="search"
                size={20}
                color="#fff"
                style={styles.searchIcon}
              />
              <TextInput
                placeholder="Search movies..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                onFocus={handleSearchFocus} // Scrolls to the search section on focus
              />
              <TouchableOpacity onPress={handleVoiceSearch}>
                <FontAwesome
                  name="microphone"
                  size={20}
                  color="#fff"
                  style={styles.voiceIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Results Section */}
          {results.length > 0 && (
            <ScrollView style={styles.searchResults}>
              {results.map((movie) => {
                const posterUrl = movie.poster_path
                  ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                  : "https://via.placeholder.com/100x150?text=No+Poster";
                const releaseYear = movie.release_date
                  ? movie.release_date.slice(0, 4)
                  : "N/A";
                return (
                  <TouchableOpacity
                    key={movie.id.toString()}
                    style={styles.searchResultCard}
                    onPress={() =>
                      navigation.navigate("MovieDetails", {
                        movieId: movie.id.toString(),
                      })
                    }
                  >
                    <Image
                      source={{ uri: posterUrl }}
                      style={styles.searchResultImage}
                      resizeMode="cover"
                    />
                    <View style={styles.searchResultDetails}>
                      <Text style={styles.searchResultTitle}>
                        {movie.title}
                      </Text>
                      <Text style={styles.searchResultYear}>
                        Year: {releaseYear}
                      </Text>
                      <Text style={styles.searchResultRating}>
                        Rating:{" "}
                        {movie.vote_average
                          ? movie.vote_average.toFixed(1)
                          : "N/A"}
                      </Text>
                      <Text style={styles.searchResultCast}>
                        Cast: Not Available
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* My List Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My List</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {[1, 2, 3, 4].map((_, index) => (
                <Image
                  key={`mylist-${index}`}
                  source={{
                    uri: "https://storage.googleapis.com/a1aa/image/WSEiCPi05OpnBQxq8nUxGO1v54m8vz4Um-wFEzju5J8.jpg",
                  }}
                  style={styles.listImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>

          {/* Only on Movie+ Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Only on Movie+</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {[1, 2, 3].map((_, index) => (
                <Image
                  key={`only-${index}`}
                  source={{
                    uri: "https://storage.googleapis.com/a1aa/image/2CZjS5KKAtEuAb-1IbOQf7YCWGSGGE7q2W3fFcHRR74.jpg",
                  }}
                  style={styles.listImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>

          {/* Explore Section */}
          <View style={styles.exploreSection}>
            <Text style={styles.exploreTitle}>Welcome to Movie+</Text>
            <Text style={styles.exploreSubtitle}>
              Lorem ipsum dolor sit amet consectetur
            </Text>
            <TouchableOpacity style={styles.exploreButton}>
              <Text style={styles.exploreButtonText}>EXPLORE</Text>
            </TouchableOpacity>
          </View>

          {/* New Releases Section with overlay and clickable poster */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>New Releases</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {newReleasesLoading ||
              newReleasesError ||
              newReleases.length === 0 ? (
                <Text style={{ color: "#fff", fontFamily: "Poppins" }}>
                  Loading new releases...
                </Text>
              ) : (
                newReleases.map((movie, index) => {
                  const posterUrl = movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/128x192?text=No+Poster";
                  const releaseYear = movie.release_date
                    ? movie.release_date.slice(0, 4)
                    : "";
                  return (
                    <TouchableOpacity
                      key={movie.id || index}
                      style={styles.newReleaseItem}
                      onPress={() =>
                        navigation.navigate("MovieDetails", {
                          movieId: movie.id,
                        })
                      }
                    >
                      <Image
                        source={{ uri: posterUrl }}
                        style={styles.newReleaseImage}
                        resizeMode="cover"
                      />

                      {/* Ikon bookmark transparan di atas poster */}
                      <View style={styles.bookmarkContainer}>
                        <FontAwesome
                          name="bookmark-o"
                          size={30}
                          color="#fff"
                          style={{ opacity: 0.5 }}
                        />
                      </View>

                      <LinearGradient
                        colors={["transparent", "rgba(0,0,0,0.8)"]}
                        style={styles.newReleaseOverlay}
                      />
                      <View style={styles.newReleaseInfo}>
                        <Text style={styles.newReleaseTitle}>
                          {movie.title || "No Title"}
                        </Text>
                        <View style={styles.ratingRow}>
                          <FontAwesome
                            name="star"
                            size={10}
                            color="#FFD700"
                            style={styles.starIcon}
                          />
                          <Text style={styles.newReleaseDetails}>
                            {movie.vote_average} | {releaseYear}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              )}
              {/* Plus Item to see more */}
              <TouchableOpacity style={styles.plusItem}>
                <FontAwesome name="plus" size={24} color="#fff" />
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Top Movies Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Movies</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {[1, 2, 3].map((_, index) => (
                <Image
                  key={`top-${index}`}
                  source={{
                    uri: "https://storage.googleapis.com/a1aa/image/koPa55nsvqywKtAGBbeiwugbpFBSy8aeumuBUvJ8uRc.jpg",
                  }}
                  style={styles.listImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>

          {/* Our Top 10 Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Top 10</Text>
            <Text style={styles.sectionSubtitle}>
              Welcome to Movie+ Lorem ipsum dolor sit amet consectetur
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              <View style={styles.topItem}>
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/a1aa/image/wCyBo5hrgYAlPLoXSURku69dXoGYV-aIxh9-7iOt7z8.jpg",
                  }}
                  style={styles.topImage}
                  resizeMode="cover"
                />
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#1</Text>
                </View>
              </View>
              <View style={styles.topItem}>
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/a1aa/image/vT1xhDTNsSE_lvR4z019l4lSEKsNXCBxS6kCY0sCXtw.jpg",
                  }}
                  style={styles.topImage}
                  resizeMode="cover"
                />
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#2</Text>
                </View>
              </View>
              <View style={styles.topItem}>
                <Image
                  source={{
                    uri: "https://storage.googleapis.com/a1aa/image/YAMBQ5AaM-Ui7D7mLNGkvfJ0B8AlC6386Y-jUQvDH30.jpg",
                  }}
                  style={styles.topImage}
                  resizeMode="cover"
                />
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#3</Text>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Additional Sections */}

          {/* Most Popular Actor/Actress Section (Dynamic from TMDB) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most Popular Actor/Actress</Text>
            {popularLoading || popularError || popularPeople.length === 0 ? (
              <Text style={{ color: "#fff", fontFamily: "Poppins" }}>
                Loading popular people...
              </Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
              >
                {popularPeople.map((person, index) => {
                  // Buat URL gambar profil jika ada, gunakan ukuran w185
                  const profileUrl = person.profile_path
                    ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                    : "https://via.placeholder.com/128x128?text=No+Image";
                  return (
                    <View
                      key={person.id || index}
                      style={{ alignItems: "center", marginRight: 16 }}
                    >
                      <Image
                        source={{ uri: profileUrl }}
                        style={styles.circleImage}
                        resizeMode="cover"
                      />
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 12,
                          fontFamily: "Poppins",
                          marginTop: 4,
                          width: 128,
                          textAlign: "center",
                        }}
                      >
                        {person.name}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* What to Watch Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What to Watch</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {[1, 2, 3].map((_, index) => (
                <Image
                  key={`what-to-watch-${index}`}
                  source={{
                    uri: "https://via.placeholder.com/128x192?text=Watch",
                  }}
                  style={styles.listImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>

          {/* Top 10 User Pick This Week Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top 10 User Pick This Week</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                <Image
                  key={`user-pick-${index}`}
                  source={{
                    uri: "https://via.placeholder.com/128x192?text=User+Pick",
                  }}
                  style={styles.listImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>

          {/* Fan Favourite Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fan Favourite</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {[1, 2, 3, 4].map((_, index) => (
                <Image
                  key={`fan-favourite-${index}`}
                  source={{
                    uri: "https://via.placeholder.com/128x192?text=Fan+Fav",
                  }}
                  style={styles.listImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>

          {/* In Theater Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>In Theater</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {[1, 2, 3].map((_, index) => (
                <Image
                  key={`in-theater-${index}`}
                  source={{
                    uri: "https://via.placeholder.com/128x192?text=Theater",
                  }}
                  style={styles.listImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>

          {/* Top Box Office Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Box Office</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {[1, 2, 3].map((_, index) => (
                <Image
                  key={`box-office-${index}`}
                  source={{
                    uri: "https://via.placeholder.com/128x192?text=Box+Office",
                  }}
                  style={styles.listImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>

          {/* Recently Viewed Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recently Viewed</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalScroll}
            >
              {[1, 2, 3, 4].map((_, index) => (
                <Image
                  key={`recently-viewed-${index}`}
                  source={{
                    uri: "https://via.placeholder.com/128x192?text=Viewed",
                  }}
                  style={styles.listImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default HomeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  outerGradient: {
    flex: 1,
  },
  innerContent: {
    padding: 16,
  },
  // Wrapper carousel tanpa padding horizontal untuk menghilangkan offset
  carouselWrapper: {
    marginHorizontal: -16,
    marginBottom: 32,
  },
  carouselItem: {
    width: width,
    height: 400,
    position: "relative",
  },
  // Featured container now fills the entire width by negating innerContent's padding
  featuredContainer: {
    position: "relative",
    marginBottom: 32,
    height: 400,
    width: width, // full screen width
    marginLeft: -16, // remove left padding
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Header is now inside the featured container and moved lower
  featuredHeader: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacing: {
    marginRight: 16,
  },

  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 10, // Bring header in front of the poster
    margin: 20,
  },

  neonBorder: {
    width: 54, // Set a fixed width (image width + 2 * padding)
    height: 54, // Set a fixed height
    borderRadius: 17, // Half of width/height to make it circular
    padding: 2, // Thickness of the neon border
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 35,
  },

  featuredTextContainer: {
    position: "absolute",
    bottom: 64,
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Poppins",
    marginBottom: 20,
  },
  featuredTagline: {
    fontSize: 14,
    color: "#fff",
    marginTop: 4,
    fontFamily: "Poppins",
  },
  featuredDescription: {
    fontSize: 9,
    color: "#fff",
    marginTop: 4,
    textAlign: "center",
    fontFamily: "Poppins",
    width: "80%",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  movieInfo: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
    fontFamily: "Poppins",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    fontFamily: "Poppins",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 8,
    fontFamily: "Poppins",
  },
  horizontalScroll: {
    flexDirection: "row",
  },

  // Style untuk New Releases item
  newReleaseItem: {
    width: 128,
    height: 192,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
  },
  newReleaseImage: {
    width: "100%",
    height: "100%",
  },
  newReleaseOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  newReleaseInfo: {
    position: "absolute",
    bottom: 4,
    left: 4,
    right: 4,
    alignItems: "center",
  },
  newReleaseTitle: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Poppins",
    textAlign: "center",
  },
  newReleaseDetails: {
    color: "#fff",
    fontSize: 8,
    fontFamily: "Poppins",
    marginTop: 2,
  },
  plusItem: {
    width: 128,
    height: 192,
    borderRadius: 8,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  listImage: {
    width: 128,
    height: 192,
    borderRadius: 8,
    marginRight: 16,
  },
  exploreSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  exploreTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    fontFamily: "Poppins",
  },
  exploreSubtitle: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Poppins",
  },
  exploreButton: {
    backgroundColor: "#6B21A8",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  topItem: {
    position: "relative",
    width: 128,
    height: 192,
    marginRight: 16,
  },
  topImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  rankBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomRightRadius: 8,
  },
  rankText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  starIcon: {
    marginRight: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  circleImage: {
    width: 100,
    height: 100,
    borderRadius: 64,
  },

  // Container for the search bar for proper spacing
  searchContainer: {
    marginVertical: 16, // Adjust vertical spacing as needed
  },
  // The search bar with a transparent background
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0)", // Transparent white
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 40,
  },
  // Style for the TextInput inside the search bar
  searchInput: {
    flex: 1,
    color: "#fff",
    marginLeft: 8,
    fontFamily: "Poppins", // match your font if needed
  },
  // Optional: adjust spacing for icons if necessary
  searchIcon: {
    // e.g., marginLeft: 4,
  },
  voiceIcon: {
    marginLeft: 8,
  },
  searchResultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  // New styles for search results
  searchResults: {
    marginTop: 8,
    backgroundColor: "rgba(64, 11, 84, 0.23)",
    borderRadius: 8,
    paddingVertical: 8,
    maxHeight: 300,
  },
  searchResultCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  searchResultImage: {
    width: 80,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
  },
  searchResultDetails: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
    fontFamily: "Poppins",
  },
  searchResultYear: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
    fontFamily: "Poppins",
  },
  searchResultRating: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
    fontFamily: "Poppins",
  },
  searchResultCast: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
    fontFamily: "Poppins",
  },

  bookmarkContainer: {
    position: "absolute",
    top: -3, // atur jarak dari atas sesuai kebutuhan
    right: 10, // bisa juga diubah ke kiri jika diinginkan
    zIndex: 5, // pastikan berada di atas gambar
  },
  

});
