import { StyleSheet, Text, TouchableOpacity, Alert, View, Platform, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart as RNBarChart } from 'react-native-chart-kit'; // For mobile
import { BarChart as WebBarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts"; // For web
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from 'axios';

import { getAuthHeader } from './auth.jsx';

const screenWidth = Dimensions.get("window").width;

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

      // Create a downloadable JSON file
      const jsonBlob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(jsonBlob);

      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'report.json';
      link.click();

      Alert.alert('Success', 'Report generated successfully.');
    } catch (err) {
      console.error('Error generating report:', err);
      Alert.alert('Error', 'Failed to generate report.');
    } finally {
      setLoading(false);
    }
  };

  const chartData = [
    { name: "Users", count: metrics.userCount || 0 },
    { name: "Trips", count: metrics.tripCount || 0 },
    { name: "Bookings", count: metrics.bookingCount || 0 },
    { name: "Feedback", count: metrics.feedbackCount || 0 },
  ];

  // Ensure all counts are valid numbers
  const validChartData = chartData.map((item) => ({
    name: item.name,
    count: isNaN(Number(item.count)) ? 0 : Number(item.count),
  }));

  if (Platform.OS === 'web') {
    // Render web-specific chart and table
    return (
        <div style={styles.container}>
          <h1 style={styles.chartTitle}>Platform Usage Metrics</h1>
          {/* Bar Chart */}
          <div style={styles.chartContainer}>
            <WebBarChart
                width={500}
                height={300}
                data={validChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#0B7784" />
            </WebBarChart>
          </div>
          {/* Metrics Table */}
          <TableContainer component={Paper} style={styles.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Metric</strong></TableCell>
                  <TableCell align="right"><strong>Count</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Users</TableCell>
                  <TableCell align="right">{metrics.userCount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Trips</TableCell>
                  <TableCell align="right">{metrics.tripCount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Bookings</TableCell>
                  <TableCell align="right">{metrics.bookingCount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Feedback</TableCell>
                  <TableCell align="right">{metrics.feedbackCount}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {/* Generate Report Button */}
          <TouchableOpacity style={styles.card} onPress={generateReport} disabled={loading}>
            <Text style={styles.cardText}>{loading ? 'Generating...' : 'Generate Report'}</Text>
          </TouchableOpacity>
        </div>
    );
  }

  // Render mobile-specific chart and table
  return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.chartTitle}>Platform Usage Metrics</Text>
        <View style={styles.chartContainer}>
          <RNBarChart
              data={{
                labels: ["Users", "Trips", "Bookings", "Feedback"],
                datasets: [{ data: validChartData.map((item) => item.count) }],
              }}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(11, 119, 132, ${opacity})`,
                barPercentage: 0.5,
              }}
              verticalLabelRotation={30}
          />
        </View>
        {/* Metrics Table */}
        <View style={styles.tableContainer}>
          <Text style={styles.tableHeader}>Metrics Table</Text>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Metric</Text>
            <Text style={styles.tableCellHeader}>Total</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Users</Text>
            <Text style={styles.tableCell}>{metrics.userCount}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Trips</Text>
            <Text style={styles.tableCell}>{metrics.tripCount}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Bookings</Text>
            <Text style={styles.tableCell}>{metrics.bookingCount}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Feedback</Text>
            <Text style={styles.tableCell}>{metrics.feedbackCount}</Text>
          </View>
        </View>
        {/* Generate Report Button */}
        {/*<TouchableOpacity style={styles.card} onPress={generateReport} disabled={loading}>*/}
        {/*  <Text style={styles.cardText}>{loading ? 'Generating...' : 'Generate Report'}</Text>*/}
        {/*</TouchableOpacity>*/}
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
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCellHeader: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#0B7784',
    flex: 1,
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 14,
    color: '#555',
    flex: 1,
    textAlign: 'center',
  },
  card: {
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
  cardText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
