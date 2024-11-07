import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const ComponentLayout = () => {
  return (
    <Stack screenOptions={{
        headerStyle: {
            backgroundColor: '#0B7784', 
          },
          headerTintColor: '#F9C2A6'
        }}>
        <Stack.Screen name='[id]' options={{
            title: 'User Profile',
            headerBackTitle: 'back'
            }} />
        {/* <Stack.Screen name='userAuthForm' options={{

        }} */}
    </Stack>
  )
}

export default ComponentLayout