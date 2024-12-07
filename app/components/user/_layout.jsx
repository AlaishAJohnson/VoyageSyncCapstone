import { Stack } from 'expo-router';

const UserLayout = () => {
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
            name="edit-preferences"
            options={{
              title: 'Edit Preferences'
            }}
          />
          
        </Stack>
      );
}

export default UserLayout