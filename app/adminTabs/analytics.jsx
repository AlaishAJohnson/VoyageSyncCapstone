import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Alert, View, Dimensions, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { getAuthHeader } from './auth.jsx'; // Adjust this import based on your project structure

const Analytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [metrics, setMetrics] = useState({
    userCount: 0,
    tripCount: 0,
    bookingCount: 0,
    feedbackCount: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/reports/platform-usage', getAuthHeader());
        setMetrics(response.data);
      } catch (err) {
        console.error('Error fetching metrics:', err);
        setError('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/reports/generate', {}, getAuthHeader());
      const json = JSON.stringify(response.data, null, 2);
      const fileUri = FileSystem.documentDirectory + 'report.json';

      await FileSystem.writeAsStringAsync(fileUri, json);
      Alert.alert('Success', `Report saved at: ${fileUri}`);
    } catch (err) {
      console.error('Error generating report:', err);
      Alert.alert('Error', 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Users', 'Trips', 'Bookings', 'Feedback'],
    datasets: [
      {
        data: [metrics.userCount, metrics.tripCount, metrics.bookingCount, metrics.feedbackCount],
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#f6f6f6',
    backgroundGradientTo: '#f6f6f6',
    color: (opacity = 1) => `rgba(11, 119, 132, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    barPercentage: 0.5,
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.chartTitle}>Platform Usage Metrics</Text>

      {loading && <ActivityIndicator size="large" color="#0B7784" />}

      {/* Bar Chart */}
      <View style={styles.chartContainer}>
        <BarChart
          data={chartData}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
          style={{ borderRadius: 16 }}
        />
      </View>

      {/* Metrics Table */}
      <View style={styles.tableContainer}>
        {[
          { label: 'Users', value: metrics.userCount },
          { label: 'Trips', value: metrics.tripCount },
          { label: 'Bookings', value: metrics.bookingCount },
          { label: 'Feedback', value: metrics.feedbackCount },
        ].map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.label}</Text>
            <Text style={styles.tableCell}>{item.value}</Text>
          </View>
        ))}
      </View>

      {/* Generate Report Button */}
      <TouchableOpacity style={styles.card} onPress={generateReport} disabled={loading}>
        <Text style={styles.cardText}>{loading ? 'Generating...' : 'Generate Report'}</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </SafeAreaView>
  );
};

export default Analytics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  chartContainer: {
    backgroundColor: '#f6f6f6',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableContainer: {
    backgroundColor: '#f6f6f6',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    fontSize: 16,
    color: '#333',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    marginTop: 20,
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
  cardText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});