import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const TripLayout = () => {
  return (
    <Stack
        screenOptions={{
            headerStyle: {
            backgroundColor: '#0B7784', 
            },
            headerTintColor: '#F9C2A6'
        }}
    >
        <Stack.Screen 
            name='trip-details'
            options={{
                title: 'Trip Details',
                headerBackTitle: 'Home'
            }}
        />
    </Stack>
  )
}

export default TripLayout