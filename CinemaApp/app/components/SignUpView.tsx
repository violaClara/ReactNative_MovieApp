// SignUpView.tsx
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Alert,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";
import { useUserStore } from "../userStore";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import RootStackParamList from "../../App"; // Sesuaikan path-nya jika perlu

// Define the validation schema using Zod
const signUpSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Infer the TypeScript type for our form data
type SignUpFormData = z.infer<typeof signUpSchema>;

export type RootStackParamList = {
  SignUp: undefined;
  Login: undefined;
};

const SignUpView: React.FC = () => {
  const { registerUser } = useUserStore();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Initialize React Hook Form with Zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle form submission
  const onSubmit = (data: SignUpFormData) => {
    console.log("Form Data:", data); // Debugging
    registerUser({
      email: data.email,
      phone: data.phone,
      password: data.password,
    });
    Alert.alert("Registration Successful", "You have registered successfully!");
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={{
          uri: "https://c4.wallpaperflare.com/wallpaper/725/422/535/movies-hollywood-movies-wallpaper-preview.jpg",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(76,29,149,0.9)", "rgba(0,0,0,0.9)"]}
          style={styles.gradient}
        >
        <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title */}
            <Text style={styles.title}>Create{"\n"}Account</Text>

            {/* Form */}
            <View style={styles.form}>
              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. example@mail.com"
                      placeholderTextColor="#ddd"
                      keyboardType="email-address"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                />
                {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
              </View>

              {/* Phone Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 123-456-7890"
                      placeholderTextColor="#ddd"
                      keyboardType="phone-pad"
                      onChangeText={onChange}
                      onBlur={onBlur}
                      value={value}
                    />
                  )}
                />
                {errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroupPassword}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. Example!2006"
                        placeholderTextColor="#ddd"
                        secureTextEntry={!showPassword}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                  >
                    <FontAwesome
                      name={showPassword ? "eye-slash" : "eye"}
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputGroupPassword}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <Controller
                    control={control}
                    name="confirmPassword"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        placeholder="e.g. Example!2006"
                        placeholderTextColor="#ddd"
                        secureTextEntry={!showConfirmPassword}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeButton}
                  >
                    <FontAwesome
                      name={showConfirmPassword ? "eye-slash" : "eye"}
                      size={20}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                )}
              </View>
            </View>

            {/* Bottom container with button and footer text */}
            <View style={styles.bottomContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
                <LinearGradient
                  colors={["#3B82F6", "#8B5CF6"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Create account</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text style={styles.footerLink}>
                  Login <Text style={styles.footerLinkBold}>here</Text>
                </Text>
              </Text>
            </View>
          </ScrollView>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default SignUpView;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 32,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 100,
    marginBottom: 48,
    width: "100%",
    textAlign: "left",
    marginLeft: 64,
  },
  form: {
    width: "80%",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
    backgroundColor: "#4C1D95",
    borderWidth: 1,
    borderColor: "#7E22CE",
    borderRadius: 4,
  },
  inputGroupPassword: {
    marginBottom: 16, // Consistent spacing between input groups
    width: "100%",
  },
  passwordContainer: {
    position: "relative",
    width: "100%",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    top: 8,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 8,
  },
  // New bottom container for fixed spacing from the bottom edge
  bottomContainer: {
    position: "absolute",
    bottom: 32, // Same spacing from the bottom in both screens
    width: "80%",
    alignItems: "center",
  },
  button: {
    width: "100%",
  },
  buttonGradient: {
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    marginTop: 24,
    textAlign: "center",
    color: "#fff",
    width: "100%",
  },
  footerLink: {
    color: "#fff",
  },
  footerLinkBold: {
    fontWeight: "bold",
    color: "#fff",
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },
  
});
