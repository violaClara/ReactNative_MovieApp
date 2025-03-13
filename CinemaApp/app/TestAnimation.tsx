// TestAnimation.tsx
import React, { useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const TestAnimation: React.FC = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });
  const arrowTranslate = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });
  const dotsTranslate = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 50],
    extrapolate: "clamp",
  });
  return (
    <Animated.ScrollView
      style={styles.container}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
    >
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <Animated.Text style={{ transform: [{ translateX: arrowTranslate }] }}>
          {"<"}
        </Animated.Text>
        <Animated.Text style={{ transform: [{ translateX: dotsTranslate }] }}>
          {"..."}
        </Animated.Text>
      </Animated.View>
      <View style={{ height: 1000 }}>
        <Text style={styles.contentText}>Scroll Down to see animation</Text>
      </View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    height: 50,
    backgroundColor: "blue",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  contentText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
});

export default TestAnimation;
