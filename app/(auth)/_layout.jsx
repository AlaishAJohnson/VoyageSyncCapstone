import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../../hook/auth';
import { StatusBar } from 'expo-status-bar';

const AuthLayout = () => {
  return (
    <AuthProvider>
      {/* StatusBar should be placed outside of the Stack component */}
      <StatusBar backgroundColor='#161622' style='light'/>
      <Stack>
        <Stack.Screen
          name='sign-in'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='sign-up'
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </AuthProvider>
  );
};

export default AuthLayout;
