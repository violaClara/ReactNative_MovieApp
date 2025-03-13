// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeView from './app/components/HomeView';
import MovieDetailsView from './app/components/MovieDetailsView';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import SignUpView from './app/components/SignUpView';
import LoginView from './app/components/LoginView';


const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();



const App: React.FC = () => {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  // return (
  //   <QueryClientProvider client={queryClient}>
  //     <NavigationContainer>
  //       <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
  //         <Stack.Screen name="Home" component={HomeView} />
  //         <Stack.Screen name="MovieDetails" component={MovieDetailsView} />
  //       </Stack.Navigator>
  //     </NavigationContainer>
  //   </QueryClientProvider>
  // );


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignUp" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUp" component={SignUpView} />
        <Stack.Screen name="Login" component={LoginView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
