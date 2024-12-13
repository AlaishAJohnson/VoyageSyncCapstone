import { StyleSheet, Text, TouchableOpacity, Alert, View, Platform, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart as RNChart } from 'react-native-chart-kit'; // For mobile
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material"; // For web
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

    const getUserData = async () => {
        try {
            const storedUserId = await AsyncStorage.getItem('userId');
            if (storedUserId) {
                await fetchVendorData(storedUserId);
            } else {
                console.error('User ID not found');
                setError('User ID not found');
            }
        } catch (error) {
            console.error('Error retrieving user ID:', error);
            setError('Failed to retrieve user ID.');
        }
    };

    const fetchVendorData = async (userId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/vendors`, {
                headers: { 'Authorization': authHeader },
            });

            const vendor = response.data.find((vendor) => vendor.representativeId === userId);
            if (vendor) {
                setVendorId(vendor.vendorId);
                setBusinessName(vendor.businessName || vendor.vendorId);
                await fetchMetrics(vendor.vendorId);
            } else {
                console.error('Vendor not found for this user');
                setError('Vendor not found for this user');
            }
        } catch (err) {
            console.error('Error fetching vendor data:', err);
            setError('Failed to load vendor data');
        }
    };

    const fetchMetrics = async (vendorId) => {
        setLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/vendor-reports/metrics?vendorId=${vendorId}`, {
                headers: { 'Authorization': authHeader },
            });
            setMetrics(response.data);
        } catch (err) {
            console.error('Error fetching metrics:', err);
            setError('Failed to load metrics');
        } finally {
            setLoading(false);
        }
    };

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
            await axios.post(`${BACKEND_URL}/api/vendor-reports/generate/${vendorId}`, {}, {
                headers: { 'Authorization': authHeader },
            });
            setReportGenerated(true);
        } catch (err) {
            console.error('Error generating report:', err.response || err);
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

    const pieChartColors = ['#07a253', '#f3bd08', '#21a1fa'];

    // Render mobile-specific chart
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.chartTitle}>Vendor Metrics</Text>
            <View style={styles.chartContainer}>
                {/* Pie Chart */}
                <RNChart
                    data={chartData.map((item, index) => ({
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

            {/* Metrics Table */}
            <View style={styles.tableContainer}>
                <Text style={styles.tableTitle}> {businessName} Metrics</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHeader}>Metric</Text>
                        <Text style={styles.tableHeader}>Count</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Bookings</Text>
                        <Text style={styles.tableCell}>{metrics.bookingsCount}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Services</Text>
                        <Text style={styles.tableCell}>{metrics.servicesCount}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}>Feedback</Text>
                        <Text style={styles.tableCell}>{metrics.feedbackCount}</Text>
                    </View>
                </View>
            </View>

            {/*/!* Generate Report Button *!/*/}
            {/*<TouchableOpacity style={styles.card} onPress={generateReport} disabled={loading}>*/}
            {/*    <Text style={styles.cardText}>{loading ? 'Generating...' : 'Generate Report'}</Text>*/}
            {/*</TouchableOpacity>*/}

            {reportGenerated && (
                <View style={styles.reportContainer}>
                    <Text style={styles.reportTitle}>Report Summary for {businessName}</Text>
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
    tableContainer: {
        marginTop: 20,
        width: '100%',
    },
    tableTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    table: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    tableHeader: {
        fontWeight: 'bold',
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
    },
    tableCell: {
        fontSize: 16,
        flex: 1,
        textAlign: 'center',
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
});
export default VendorAnalytics;
