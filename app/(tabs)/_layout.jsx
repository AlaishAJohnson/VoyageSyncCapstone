import React from 'react';
import { useAuth } from '../../hook/auth'; 
import { Tabs } from 'expo-router';
// Assuming you have this component

const TabIcon = ({ icon, focused, name }) => {
  const color = focused ? '#0B7784' : '#687076';
  return (
    <View style={styles.iconContainer}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.iconLabel, { color }]}>{name}</Text>
    </View>
  );
};

const MainLayout = () => {
  const { userRole } = useAuth();

  return (
    <Tabs screenOptions={{ tabBarShowLabel: false }}>
      {userRole === 'admin' ? (
        <>
          <Tabs.Screen 
            name='messages'
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="chatbox" focused={focused} name="Messages" />
              )
            }}
          />
          <Tabs.Screen 
            name='user-management'
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="people" focused={focused} name="Users" />
              )
            }}
          />
          <Tabs.Screen 
            name='analytics'
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="analytics" focused={focused} name="Analytics" />
              )
            }}
          />
          <Tabs.Screen 
            name='admin-home'
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="home" focused={focused} name="Home" />
              )
            }}
          />
          <Tabs.Screen 
            name='system-settings'
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="cog" focused={focused} name="System" />
              )
            }}
          />
          <Tabs.Screen 
            name='admin-profile'
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="person" focused={focused} name="Profile" />
              )
            }}
          />
        </>
      ) : (
        <>
          <Tabs.Screen 
            name='messages'
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="chatbox" focused={focused} name="Messages" />
              )
            }}
          />
          <Tabs.Screen 
            name='location'
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="location" focused={focused} name="Location" />
              )
            }}
          />
          <Tabs.Screen 
            name='user-home'
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="home" focused={focused} name="Home" />
              )
            }}
          />
          <Tabs.Screen 
            name='explore'
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="search" focused={focused} name="Explore" />
              )
            }}
          />
          <Tabs.Screen 
            name='user-profile'
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <TabIcon icon="person" focused={focused} name="Profile" />
              )
            }}
          />
        </>
      )}
    </Tabs>
  );
};

export default MainLayout;
