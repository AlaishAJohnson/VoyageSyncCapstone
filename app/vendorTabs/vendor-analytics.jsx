import { StyleSheet, Text, TouchableOpacity, Alert, View, Platform, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart as RNChart } from 'react-native-chart-kit'; // For mobile
import { PieChart as WebPieChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell } from "recharts"; // For web
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import RenderHTML from 'react-native-render-html'; // For rendering HTML in mobile
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get("window").width;
const BACKEND_URL = 'http://localhost:8080';
const authHeader = 'Basic ' + btoa('admin:admin');

const VendorAnalytics = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [metrics, setMetrics] = useState({
        bookingsCount: 0,
        servicesCount: 0,
        feedbackCount: 0,
    });
    const [vendorId, setVendorId] = useState(null);
    const [businessName, setBusinessName] = useState(''); // State for business name
    const [reportGenerated, setReportGenerated] = useState(false);

    // Fetch user ID from AsyncStorage and then get the corresponding vendorId
    const getUserData = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId'); // Retrieve userId from AsyncStorage
            console.log('Stored userId from AsyncStorage:', storedUserId);

            if (storedUserId) {
                await fetchVendorData(storedUserId); // Fetch vendor data once userId is retrieved
            } else {
                console.error('User ID not found');
                setError('User ID not found');
            }
        } catch (error) {
            console.error('Error retrieving user ID:', error);
            setError('Failed to retrieve user ID.');
        }
    };

    // Fetch vendor details using userId
    const fetchVendorData = async (userId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/vendors`, {
                headers: {
                    'Authorization': authHeader,
                },
            });

            const vendor = response.data.find((vendor) => vendor.representativeId === userId);
            if (vendor) {
                setVendorId(vendor.vendorId); // Set the vendorId if found
                setBusinessName(vendor.businessName || vendor.vendorId); // Set the business name or use vendorId as fallback
                await fetchMetrics(vendor.vendorId); // Fetch metrics once vendorId is retrieved
            } else {
                console.error('Vendor not found for this user');
                setError('Vendor not found for this user');
            }
        } catch (err) {
            console.error('Error fetching vendor data:', err);
            setError('Failed to load vendor data');
        }
    };

    // Fetch metrics from backend using vendorId
    const fetchMetrics = async (vendorId) => {
        setLoading(true);
        try {
            console.log('Fetching metrics for vendorId:', vendorId); // Debugging log
            const response = await axios.get(`${BACKEND_URL}/api/vendor-reports/metrics?vendorId=${vendorId}`, {
                headers: {
                    'Authorization': authHeader,
                },
            });
            console.log('Metrics fetched successfully:', response.data); // Debugging log
            setMetrics(response.data); // Set metrics data
        } catch (err) {
            console.error('Error fetching metrics:', err);
            setError('Failed to load metrics');
        } finally {
            setLoading(false);
        }
    };

    // Initialize on component mount
    useEffect(() => {
        getUserData();
    }, []);

    const generateReport = async () => {
        if (!vendorId) {
            Alert.alert('Error', 'Vendor ID is missing.');
            return;
        }

        setLoading(true);
        try {
            console.log('Generating report for vendorId:', vendorId); // Debugging log
            const response = await axios.post(`${BACKEND_URL}/api/vendor-reports/generate/${vendorId}`, {}, {
                headers: {
                    'Authorization': authHeader,
                },
            });

            console.log('Report generated successfully:', response.data); // Debugging log
            setReportGenerated(true); // Set state to show the report tab

        } catch (err) {
            console.error('Error generating report:', err.response || err); // Detailed error log
            Alert.alert('Error', 'Failed to generate report.');
        } finally {
            setLoading(false);
        }
    };

    const chartData = [
        { name: "Bookings", count: metrics.bookingsCount || 0 },
        { name: "Services", count: metrics.servicesCount || 0 },
        { name: "Feedback", count: metrics.feedbackCount || 0 },
    ];

    // Ensure all counts are valid numbers
    const validChartData = chartData.map((item) => ({
        name: item.name,
        count: isNaN(Number(item.count)) ? 0 : Number(item.count),
    }));

    // Pie chart colors (for mobile and web)
    const pieChartColors = ['#07a253', '#f3bd08', '#21a1fa'];

    if (Platform.OS === 'web') {
        // Render web-specific chart and table
        return (
            <div style={styles.container}>
                <h1 style={styles.chartTitle}>Vendor Metrics</h1>
                {/* Pie Chart */}
                <div style={styles.chartContainer}>
                    <WebPieChart
                        width={500}
                        height={300}
                        data={validChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <Tooltip />
                        <Legend />
                        {validChartData.map((entry, index) => (
                            <Cell key={index} fill={pieChartColors[index]} />
                        ))}
                    </WebPieChart>
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
                                <TableCell>Bookings</TableCell>
                                <TableCell align="right">{metrics.bookingsCount}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Services</TableCell>
                                <TableCell align="right">{metrics.servicesCount}</TableCell>
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

                {/* Show the Report Section After Generating */}
                {reportGenerated && (
                    <div style={styles.reportContainer}>
                        <h3>Report Summary for {businessName}</h3>
                        <p><strong>Bookings Count:</strong> {metrics.bookingsCount}</p>
                        <p><strong>Services Count:</strong> {metrics.servicesCount}</p>
                        <p><strong>Feedback Count:</strong> {metrics.feedbackCount}</p>
                    </div>
                )}
            </div>
        );
    }

    // Render mobile-specific chart
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.chartTitle}>Vendor Metrics</Text>
            <View style={styles.chartContainer}>
                {/* Pie Chart for mobile */}
                <RNChart
                    data={validChartData.map((item, index) => ({
                        name: item.name,
                        population: item.count,
                        color: pieChartColors[index],
                        legendFontColor: '#7F7F7F',
                        legendFontSize: 12,
                    }))}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={{
                        backgroundGradientFrom: "#fff",
                        backgroundGradientTo: "#fff",
                        color: (opacity = 1) => `rgba(11, 119, 132, ${opacity})`,
                        barPercentage: 0.5,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                />
            </View>
            {/* Generate Report Button */}
            <TouchableOpacity style={styles.card} onPress={generateReport} disabled={loading}>
                <Text style={styles.cardText}>{loading ? 'Generating...' : 'Generate Report'}</Text>
            </TouchableOpacity>

            {/* Show the Report Section After Generating */}
            {reportGenerated && (
                <View style={styles.reportContainer}>
                    <Text style={styles.reportTitle}>Report Summary for</Text>
                    <Text style={styles.reportTitle}> {businessName}:</Text>
                    <Text style={styles.reportText}>Bookings Count: {metrics.bookingsCount}</Text>
                    <Text style={styles.reportText}>Services Count: {metrics.servicesCount}</Text>
                    <Text style={styles.reportText}>Feedback Count: {metrics.feedbackCount}</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        padding: 16,
    },
    chartTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    chartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        marginTop: 20,
        backgroundColor: '#21a1fa',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reportContainer: {
        marginTop: 20,
        backgroundColor: '#d5d2d2',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reportTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    reportText: {
        fontSize: 16,
    },
    tableContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
});
export default VendorAnalytics;
