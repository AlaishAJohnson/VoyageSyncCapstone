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
  

const AdminLayout = () => {
  return (
    <Tabs
      screenOptions={{ tabBarShowLabel: false }} // Hide labels if you prefer
      initialRouteName="admin-home" // Set your desired default tab
    >
      <Tabs.Screen 
        name='messages'
        options={{
          title: 'Messages',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              icon='chatbox'
              focused={focused}
              name="Messages"
            />
          )
        }}
      />
      <Tabs.Screen 
        name='user-management'
        options={{
          title: 'User Management',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              icon='people'
              focused={focused}
              name="Users"
            />
          )
        }}
      />
      <Tabs.Screen 
        name='analytics'
        options={{
          title: 'Analytics',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              icon='analytics'
              focused={focused}
              name="Analytics"
            />
          )
        }}
      />
      <Tabs.Screen 
        name='admin-home'
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              icon='home'
              focused={focused}
              name="Home"
            />
          )
        }}
      />
      <Tabs.Screen 
        name='system-settings'
        options={{
          title: 'System',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              icon='cog'
              focused={focused}
              name="System"
            />
          )
        }}
      />
      <Tabs.Screen 
        name='admin-profile'
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              icon='person'
              focused={focused}
              name="Profile"
            />
          )
        }}
      />
    </Tabs>
  );
};

export default AdminLayout;
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