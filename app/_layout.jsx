import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Slot, Stack } from 'expo-router';
import { AuthProvider } from '../hook/auth';

const RootLayout = () => {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* This will handle authentication routes */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        
        {/* Main application routes should be under (tabs) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
};

export default RootLayout;
