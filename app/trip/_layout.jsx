import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Stack, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';

const TripLayout = () => {
    const router = useRouter();
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
            name='[tripId]'
            options={({ navigation }) => ({
                title: 'Trip Details',
                headerBackTitleVisible: false, 
                headerLeft: () => (
                <TouchableOpacity 
                    onPress={() => router.push('/userTabs/user-home')}
                    style={{ flexDirection: 'row', alignItems: 'center' }} 
                >
                    <Ionicons name="arrow-back" size={24} color="#F9C2A6" />
                    <Text style={{ marginLeft: 8, color: '#F9C2A6', fontSize: 18 }}>Home</Text>
                </TouchableOpacity>
                ),
            })}
        />
        <Stack.Screen 
            name='create-trip'
            options={{
                title: 'Create Trip',
                headerBackTitle: 'Home'
            }}
        />
        <Stack.Screen 
            name='itinerary'
            options={{
                title: 'Itinerary',
                headerBackTitle: 'Details'
            }}
        />
    </Stack>
  )
}

export default TripLayout