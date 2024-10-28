import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'

const TabIcon = ({ icon, focused, name}) => {
  const color = focused ? '#0B7784' : '#687076';
  return (
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.iconLabel, { color }]}>{name}</Text>
    </View>

  )
}

const UserLayout = () => {
  return (
      <Tabs 
        initialRouteName="user-home"
        screenOptions={{
          tabBarShowLabel: false
        
      }}>
        <Tabs.Screen 
          name="messages"
          options={{
            title: 'Messages',
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                icon="chatbox"
                focused= {focused}
                name="Messages"
              />
            ) 
          }}
        />
        <Tabs.Screen 
          name="location"
          options={{
            title: "Location",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                icon="location"
                focused={focused}  
                name="Location"
              />
            )
          }}
        />
        <Tabs.Screen 
          name="user-home"
          options={{
            title: 'Home', 
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                icon="home" 
                focused={focused} 
                name="Home"
              />
            )
          }}
        />
        <Tabs.Screen 
          name="explore"
          options={{
            title: 'Explore', 
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                icon="search" 
                focused={focused} 
                name="Explore"
              />
            )
          }}
        />
        <Tabs.Screen 
          name="user-profile"
          options={{
            title: 'Profile', 
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon 
                icon="person" 
                focused={focused} 
                name="Profile"
              />
            )
          }}
        />
      </Tabs>
  )
}
const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLabel: {
    fontSize: 10, 
    marginTop: 2, 
  },
}); 
export default UserLayout