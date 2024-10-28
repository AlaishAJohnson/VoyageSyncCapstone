import { Stack } from 'expo-router';

const BookingLayout = () => {
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
        name="[id]"
        options={{
          title: 'Service Details'
        }}
      />
      <Stack.Screen 
        name="booking" 
        options={{
          title: 'Booking',
          headerBackTitle: 'Service De...'
          
        }}
      />
      <Stack.Screen 
        name="booking-confirmation"
        options={{
          title: 'Booking Confirmation',
          headerBackTitle: 'Booking'
        }}
      />
    </Stack>
  );
};

export default BookingLayout;
