import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const cardData = [
  { id: '1', title: 'User Management', value: '120 Users' },
  { id: '2', title: 'Active Sessions', value: '75 Active' },
  { id: '3', title: 'Pending Approvals', value: '15 Requests' },
  { id: '4', title: 'Revenue', value: '$5,000' },
  // Add more cards as needed
];

const AdminDashboard = () => {
  const renderCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardValue}>{item.value}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cardData}
        renderItem={renderCard}
        keyExtractor={item => item.id}
        numColumns={2} // Number of columns
        columnWrapperStyle={styles.row} // Style for each row
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginTop: 50
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    margin: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#0B7784',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 16,
    color: '#fff',
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default AdminDashboard;
