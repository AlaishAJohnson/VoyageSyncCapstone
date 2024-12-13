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
      screenOptions={{ tabBarShowLabel: false }} 
      initialRouteName="analytics" // default tab
    >
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
