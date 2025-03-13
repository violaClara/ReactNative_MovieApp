// LoginView.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';


const LoginView: React.FC = () => {
  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={{ uri: 'https://c4.wallpaperflare.com/wallpaper/725/422/535/movies-hollywood-movies-wallpaper-preview.jpg' }}
        style={styles.background}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(76,29,149,0.9)', 'rgba(0,0,0,0.9)']}
          style={styles.gradient}
        >
        
          {/* Title */}
          <Text style={styles.title}>Login</Text>

          {/* Form */}
          <View style={styles.form}>
            {/* Email input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. example@mail.com"
                placeholderTextColor="#ddd"
                keyboardType="email-address"
              />
            </View>

            {/* Password input with eye icon */}
            <View style={styles.inputGroupPassword}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Example!2006"
                  placeholderTextColor="#ddd"
                  secureTextEntry
                />
                <FontAwesome
                  name="eye"
                  size={20}
                  color="#fff"
                  style={styles.eyeIcon}
                />
              </View>
            </View>

            {/* Login button with gradient */}
            <TouchableOpacity style={styles.button}>
              <LinearGradient
                colors={['#3B82F6', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer text */}
          <Text style={styles.footerText}>
            Don’t have an account?{' '}
            <Text style={styles.footerLink}>
              Sign Up <Text style={styles.footerLinkBold}>here</Text>
            </Text>
          </Text>
        </LinearGradient>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default LoginView;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Full-screen gradient overlay from purple (top) to black (bottom)
  gradient: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60, // Reduced top padding to place header and title higher
    paddingBottom: 32,
    justifyContent: 'flex-start', // Align items from the top
    alignItems: 'center',
  },

 
  hiddenPlaceholder: {
    color: '#fff',
    opacity: 0,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 100,
    marginBottom: 48, // Slightly reduced to keep title high
    width: '100%',
    textAlign: 'left',
    marginLeft: 64,
  },
  form: {
    width: '80%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#fff',
    backgroundColor: '#4C1D95',
    borderWidth: 1,
    borderColor: '#7E22CE',
    borderRadius: 4,
  },
  inputGroupPassword: {
    marginBottom: 80, // Increased space after password field
    width: '100%',
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 8,
  },
  button: {
    width: '100%',
    marginTop: 148, // Added margin to widen space between password field and button
  },
  buttonGradient: {
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 24,
    textAlign: 'center',
    color: '#fff',
    width: '100%',
  },
  footerLink: {
    color: '#fff',
  },
  footerLinkBold: {
    fontWeight: 'bold',
    color: '#fff',
  },
});
