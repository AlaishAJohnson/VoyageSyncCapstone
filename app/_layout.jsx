import React, { useEffect, useState } from 'react';
import { Slot, Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../hook/auth';  
import { Text, View } from 'react-native'; 

const RootLayout = () => {
  return (
    <AuthProvider> 
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
       
      </Stack>
    </AuthProvider>
  );
};

const RootContent = () => {
  const { isAuthenticated } = useAuth();  e
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Auth status:', isAuthenticated); // Log the authentication status
    if (isAuthenticated !== null) {
      setLoading(false);  // Set loading to false once authentication status is determined
    }
  }, [isAuthenticated]);

  // Show a loading state while checking authentication status
  if (loading) {
    return <Text>Loading...</Text>;  // Wrap the "Loading..." text inside a Text component
  }
  return (
    <View>
     
      {!isAuthenticated ? (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </View>
  );
};

export default RootLayout;
