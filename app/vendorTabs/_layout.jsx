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

const VendorLayout = () => {
    return (
        <Tabs 
          initialRouteName="vendor-home"
          screenOptions={{
            tabBarShowLabel: false
          
        }}>
            <Tabs.Screen
              name="vendor-bookings"
              options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <TabIcon icon="file-tray-full-outline" focused={focused} name="Bookings" />
                ),
              }}
            />
            <Tabs.Screen
              name="vendor-services"
              options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <TabIcon icon="bag" focused={focused} name="Services" />
                ),
              }}
            />
            <Tabs.Screen
              name="vendor-home"
              options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <TabIcon icon="home" focused={focused} name="Home" />
                ),
              }}
            />
            <Tabs.Screen
              name="vendor-analytics"
              options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <TabIcon icon="analytics-outline" focused={focused} name="Analytics" />
                ),
              }}
            />
            <Tabs.Screen
              name="vendor-profile"
              options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <TabIcon icon="person" focused={focused} name="Profile" />
                ),
              }}
            />
        </Tabs>
    )
}

export default VendorLayout

const styles = StyleSheet.create({})