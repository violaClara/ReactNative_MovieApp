// MovieDetailsView.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import {
  useRoute,
  useNavigation,
  NavigationProp,
} from "@react-navigation/native";
import { useMovieDetails } from "../../src/hooks/useMovieDetails"; // Adjust the path if needed
import { useSimilarMovies } from "../../src/hooks/useSimilarMovies"; // Adjust the path if needed
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useMovieVideos } from "../../src/hooks/useMovieVideos"; // New hook import
import Video from "react-native-video";
import ModalComponent from "react-native-modal";
import YoutubePlayer from "react-native-youtube-iframe";
import { useMovieCredits } from "../../src/hooks/useMovieCredits";

const { width } = Dimensions.get("window");

const renderStars = (voteAverage: number) => {
  const ratingOutOfFive = voteAverage / 2;
  const fullStars = Math.floor(ratingOutOfFive);
  const halfStar = ratingOutOfFive - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  const stars = [];
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FontAwesome key={`full-${i}`} name="star" size={16} color="#FFD700" />
    );
  }
  if (halfStar) {
    stars.push(
      <FontAwesome
        key="half"
        name="star-half-empty"
        size={16}
        color="#FFD700"
      />
    );
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FontAwesome key={`empty-${i}`} name="star-o" size={16} color="#FFD700" />
    );
  }
  return stars;
};

const MovieDetailsView: React.FC = () => {
  // State variables to toggle dropdowns
  const [producersOpen, setProducersOpen] = useState(false);
  const [directorsOpen, setDirectorsOpen] = useState(false);
  const [writersOpen, setWritersOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  type RootStackParamList = {
    Home: undefined;
    MovieDetails: { movieId: string };
  };

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { movieId } = route.params as { movieId: string };

  // Use the new hook for videos
  const {
    data: videos,
    isLoading: videosLoading,
    error: videosError,
  } = useMovieVideos(movieId);

  const {
    data: credits,
    isLoading: creditsLoading,
    error: creditsError,
  } = useMovieCredits(movieId);

  const { data, isLoading, error } = useMovieDetails(movieId);
  const {
    data: similarMovies,
    isLoading: similarLoading,
    error: similarError,
  } = useSimilarMovies(movieId);

  const producers =
    credits?.crew?.filter(
      (member: { job: string }) => member.job === "Producer"
    ) || [];
  const directors =
    credits?.crew?.filter(
      (member: { job: string }) => member.job === "Director"
    ) || [];
  const writers =
    credits?.crew?.filter(
      (member: { job: string }) =>
        member.job === "Writer" ||
        member.job === "Screenplay" ||
        member.job === "Story"
    ) || [];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Error loading movie details.</Text>
      </View>
    );
  }

  // Sort videos so the trailer is always first
  const sortedVideos = videos
    ? [...videos].sort((a, b) => (a.type === "Trailer" ? -1 : 1))
    : [];

  return (
    <ScrollView style={styles.container}>
      {/* Top Section with Background Image */}
      <View style={styles.topSection}>
        <Image
          source={{
            uri: `https://image.tmdb.org/t/p/w500${data.backdrop_path}`,
          }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        {/* Header Icons (Back and More) */}
        <View style={styles.headerOverlay}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <FontAwesome name="chevron-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Image
            source={{
              uri: "https://storage.googleapis.com/a1aa/image/DE8c6iJltAvfIUf2ZemPVxQWvouCBxGREfJ9VsbTeSY.jpg",
            }}
            style={styles.profileImage}
          />
        </View>

        {/* Bottom Overlay with Gradient and Content */}
        <LinearGradient
          colors={["#111827", "transparent"]}
          style={styles.bottomOverlay}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
        >
          <View style={styles.bottomContent}>
            <Text style={styles.movieTitle}>{data.title}</Text>
            {/* Rating Row */}
            <View style={styles.infoRow}>
              <FontAwesome
                name="star"
                size={16}
                color="#FFD700"
                style={styles.detailStar}
              />
              <Text style={styles.infoText}>
                {data.vote_average} |{" "}
                {data.release_date ? data.release_date.slice(0, 4) : ""}
              </Text>
            </View>
            {/* Genre Row */}
            <View style={styles.genreRow}>
              {data.genres &&
                data.genres.map(
                  (genre: { id: number; name: string }, idx: number) => (
                    <View key={genre.id || idx} style={styles.genreButton}>
                      <Text style={styles.genreText}>{genre.name}</Text>
                    </View>
                  )
                )}
            </View>
            <Text style={styles.description}>{data.overview}</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Extras Section with Videos */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Extras</Text>
        {videosLoading ? (
          <Text style={styles.loadingText}>Loading videos...</Text>
        ) : videosError || videos.length === 0 ? (
          <Text style={styles.loadingText}>No extra videos available.</Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {sortedVideos.map((video, index) => (
              <TouchableOpacity
                key={video.id || index}
                style={styles.extraItem}
                onPress={() => {
                  setSelectedVideo(video.key);
                  setModalVisible(true);
                }}
              >
                <Image
                  source={{
                    uri: `https://img.youtube.com/vi/${video.key}/mqdefault.jpg`,
                  }}
                  style={styles.extraImage}
                  resizeMode="cover"
                />
                <Text style={styles.extraTitle}>{video.name}</Text>
                <Text style={styles.extraSubtitle}>
                  {video.type} {video.size && `${video.size}p`}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* More Similar Content Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>More Similar Content</Text>
        {similarLoading || similarError || similarMovies.length === 0 ? (
          <Text style={{ color: "#fff", fontFamily: "Poppins" }}>
            Loading similar movies...
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {similarMovies.map((movie, idx) => {
              const posterUrl = movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "https://via.placeholder.com/128x192?text=No+Poster";
              const releaseYear = movie.release_date
                ? movie.release_date.slice(0, 4)
                : "";
              return (
                <TouchableOpacity
                  key={movie.id || idx}
                  style={styles.newReleaseItem} // Reusing similar style as New Releases
                  onPress={() =>
                    // Use push to add a new instance even if we're already on MovieDetailsView
                    navigation.push("MovieDetails", { movieId: movie.id })
                  }
                >
                  <Image
                    source={{ uri: posterUrl }}
                    style={styles.newReleaseImage}
                    resizeMode="cover"
                  />
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
            })}
            {/* Plus Item to see more (optional) */}
            <TouchableOpacity style={styles.plusItem}>
              <FontAwesome name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      {/* Cast Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Cast</Text>
        {creditsLoading ? (
          <Text style={styles.loadingText}>Loading cast...</Text>
        ) : creditsError ? (
          <Text style={styles.loadingText}>Error loading cast.</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {credits.cast.map(
              (
                actor: {
                  id: number;
                  profile_path: string;
                  name: string;
                  character: string;
                },
                index: number
              ) => {
                const profileUrl = actor.profile_path
                  ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                  : "https://via.placeholder.com/128x128?text=No+Image";
                return (
                  <View key={actor.id || index} style={styles.castItem}>
                    <Image
                      source={{ uri: profileUrl }}
                      style={styles.circleImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.castName}>{actor.name}</Text>
                    {/* Optionally show the character name */}
                    <Text style={styles.castCharacter}>{actor.character}</Text>
                  </View>
                );
              }
            )}
          </ScrollView>
        )}
      </View>

      {/* Producers Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Producers</Text>
        <TouchableOpacity onPress={() => setProducersOpen(!producersOpen)}>
          <View style={styles.rowBetween}>
            <Text style={styles.rowText}>
              {producers.length > 0 ? producers[0].name : "No Producer"}
            </Text>
            <FontAwesome name="chevron-down" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        {producersOpen && (
          <View style={styles.dropdown}>
            {producers.map(
              (
                producer: {
                  name:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                },
                idx: React.Key | null | undefined
              ) => (
                <Text key={idx} style={styles.dropdownItem}>
                  {producer.name}
                </Text>
              )
            )}
          </View>
        )}
      </View>

      {/* Directors Section with Dropdown Dummy Data */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Directors</Text>
        <TouchableOpacity onPress={() => setDirectorsOpen(!directorsOpen)}>
          <View style={styles.rowBetween}>
            <Text style={styles.rowText}>
              {directors.length > 0 ? directors[0].name : "No Director"}
            </Text>
            <FontAwesome name="chevron-down" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        {directorsOpen && (
          <View style={styles.dropdown}>
            {directors.map(
              (
                director: {
                  name:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                },
                idx: React.Key | null | undefined
              ) => (
                <Text key={idx} style={styles.dropdownItem}>
                  {director.name}
                </Text>
              )
            )}
          </View>
        )}
      </View>

      {/* Writers Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Writers</Text>
        <TouchableOpacity onPress={() => setWritersOpen(!writersOpen)}>
          <View style={styles.rowBetween}>
            <Text style={styles.rowText}>
              {writers.length > 0 ? writers[0].name : "No Writer"}
            </Text>
            <FontAwesome name="chevron-down" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        {writersOpen && (
          <View style={styles.dropdown}>
            {writers.map(
              (
                writer: {
                  name:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<
                        any,
                        string | React.JSXElementConstructor<any>
                      >
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                },
                idx: React.Key | null | undefined
              ) => (
                <Text key={idx} style={styles.dropdownItem}>
                  {writer.name}
                </Text>
              )
            )}
          </View>
        )}
      </View>
      {/* Rating Section */}
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Rating</Text>
        <TouchableOpacity onPress={() => setRatingOpen(!ratingOpen)}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {renderStars(data.vote_average)}
              <Text style={[styles.rowText, { marginLeft: 8 }]}>
                {data.vote_average.toFixed(1)}/10
              </Text>
            </View>
            <FontAwesome name="chevron-down" size={20} color="#fff" />
          </View>
        </TouchableOpacity>
        {ratingOpen && (
          <View style={styles.dropdown}>
            <Text style={styles.dropdownItem}>
              TMDB Rating: {data.vote_average}/10
            </Text>
            <Text style={styles.dropdownItem}>
              Vote Count: {data.vote_count}
            </Text>
            {/* Kamu bisa menambahkan detail rating lain jika ada */}
          </View>
        )}
      </View>

      {/* Modal for Video Playback */}

      <ModalComponent
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View
          style={[
            styles.modalContent,
            { width: width, height: width * 0.5625 },
          ]}
        >
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setModalVisible(false)}
          >
            <FontAwesome name="times" size={24} color="#fff" />
          </TouchableOpacity>
          {selectedVideo && (
            <YoutubePlayer
              height={width * 0.5625}
              width={width}
              play={true}
              videoId={selectedVideo}
              initialPlayerParams={{
                modestbranding: true,
                controls: true,
              }}
            />
          )}
        </View>
      </ModalComponent>
    </ScrollView>
  );
};

export default MovieDetailsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111827", // Tailwind's bg-gray-900
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111827",
  },
  loadingText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Poppins_400Regular",
  },
  // Top Section
  topSection: {
    position: "relative",
  },
  backgroundImage: {
    width: "100%",
    height: 812,
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
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bottomOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  bottomContent: {
    // Container for gradient content at the bottom of the image
  },
  movieTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Poppins_700Bold",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  detailStar: {
    marginRight: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "Poppins_400Regular",
  },
  genreRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 8,
  },
  genreButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  genreText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "Poppins_400Regular",
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  playButton: {
    backgroundColor: "#fff",
    borderRadius: 999,
    padding: 8,
    marginRight: 16,
  },
  plusButton: {
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 999,
    padding: 8,
  },
  description: {
    marginTop: 16,
    fontSize: 14,
    color: "#9CA3AF",
    fontFamily: "Poppins_400Regular",
  },
  // Extras Section
  section: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#fff",
    fontFamily: "Poppins_700Bold",
  },
  horizontalScroll: {
    flexDirection: "row",
  },
  extraItem: {
    width: 160, // 10rem = 160px
    marginRight: 16,
  },
  extraImage: {
    width: "100%",
    height: 90,
    borderRadius: 8,
  },
  extraTitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins_400Regular",
  },
  extraSubtitle: {
    fontSize: 12,
    color: "#9CA3AF",
    fontFamily: "Poppins_400Regular",
  },
  // Similar Content Section
  similarItem: {
    width: 160,
    marginRight: 16,
  },
  similarImage: {
    width: "100%",
    height: 240,
    borderRadius: 8,
  },
  similarTitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins_400Regular",
  },
  // Cast and Crew Section
  castContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  castColumn: {
    flex: 1,
  },
  castText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
    fontFamily: "Poppins_400Regular",
  },
  // Row with chevron (Producers, Directors, etc.)
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowText: {
    fontSize: 14,
    color: "#fff",
    fontFamily: "Poppins_400Regular",
  },
  dropdown: {
    paddingVertical: 8,
    paddingLeft: 16,
  },
  dropdownItem: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
    fontFamily: "Poppins_400Regular",
  },
  // New Releases (and Similar Content) styles (reused)
  newReleaseItem: {
    width: 128,
    height: 192,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 16,
  },
  newReleaseImage: { width: "100%", height: "100%" },
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
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  starIcon: { marginRight: 4 },
  newReleaseDetails: { color: "#fff", fontSize: 8, fontFamily: "Poppins" },
  plusItem: {
    width: 128,
    height: 192,
    borderRadius: 8,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  modal: {
    margin: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#000",
    justifyContent: "center",
  },
  videoContainer: {
    backgroundColor: "#000",
  },
  videoWebView: {
    backgroundColor: "#000",
  },
  modalCloseButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
  },

  castItem: {
    alignItems: "center",
    marginRight: 16,
  },

  circleImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // membuatnya menjadi lingkaran
    marginBottom: 8,
  },
  castName: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins",
    textAlign: "center",
    width: 100,
  },

  castCharacter: {
    fontSize: 10,
    color: "#9CA3AF",
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
  },
});
