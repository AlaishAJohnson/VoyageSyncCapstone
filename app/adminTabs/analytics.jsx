import { StyleSheet, Text, TouchableOpacity, Alert, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useEffect, useState } from 'react';
import axios from 'axios';

import { getAuthHeader } from './auth.jsx';

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
    { name: "Users", count: metrics.userCount },
    { name: "Trips", count: metrics.tripCount },
    { name: "Bookings", count: metrics.bookingCount },
    { name: "Feedback", count: metrics.feedbackCount },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.chartTitle}>Platform Usage Metrics</h1>
      {/* Bar Chart */}
      <div style={styles.chartContainer}>
        <BarChart width={500} height={300} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#0B7784" />
        </BarChart>
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

export default Analytics

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  chartContainer: {
    //#0B7784
    backgroundColor: '#f6f6f6',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 15,
    display: 'flex',
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
  tableHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingVertical: 10,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tableCell: {
    fontSize: 14,
    color: '#555',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Arial, sans-serif',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
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
  cardText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
};