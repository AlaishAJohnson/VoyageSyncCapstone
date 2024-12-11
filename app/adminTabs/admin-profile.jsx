import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView
} from "react-native";
import React, { useState, useEffect } from "react";
import {router, useRouter} from 'expo-router';
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKEND_URL = "http://localhost:8080";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState('');

  const authHeader = "Basic " + btoa("admin:admin");

  const fetchAdminProfile = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) throw new Error("User ID not found");

      const response = await axios.get(
          `${BACKEND_URL}/api/users/${storedUserId}`,
          {
            headers: { Authorization: authHeader },
          }
      );

      setAdminData(response.data);
      setUsername(response.data.username || "");
      setFirstName(response.data.firstName || "");
      setLastName(response.data.lastName || "");
      setPhoneNumber(response.data.phoneNumber || '');
    } catch (error) {
      console.error("Error fetching admin profile data:", error);
      Alert.alert("Error", "Failed to load profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const checkUsernameExists = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/users/username/${username}`, {
        headers: { Authorization: authHeader },
      });
      Alert.alert("Error", "Username already exists. Please choose another.");
      return true;
    } catch (error) {
      if (error.response && error.response.status === 404) return false;
      console.error("Error checking username:", error);
      Alert.alert(
          "Error",
          "An error occurred while checking the username. Please try again."
      );
      return true;
    }
  };

  const updateAdminProfile = async () => {
    setSaving(true);
    try {
      // Fetch the stored user ID
      const storedUserId = await AsyncStorage.getItem("userId");
      if (!storedUserId) {
        Alert.alert("Error", "User ID not found.");
        setSaving(false);
        return;
      }
      // Check if username exists
      if (await checkUsernameExists()) {
        setSaving(false);
        return;
      }
      const updates = {
        username,
        firstName,
        lastName,
        ...(password && { password }), // Include password only if it exists
        phoneNumber,
      };

      // Make API call to update the profile
      await axios.put(
          `${BACKEND_URL}/api/users/update/${storedUserId}`,
          updates,
          {
            headers: { Authorization: authHeader },
          }
      );

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating admin profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
    console.log('User signed out');
    router.push('/');
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  if (loading) {
    return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0B7784" />
        </View>
    );
  }
  return (
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.header}>Your Admin Profile</Text>

          <View style={styles.section}>
            <Text style={styles.label}>Admin ID:</Text>
            <View style={styles.adminIdBox}>
              <Text style={styles.value}>{adminData.userId}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Current Username:</Text>
            <Text style={styles.value}>{adminData.username}</Text>
          </View>

          <Text style={styles.editableHeader}>Change Your Info :</Text>

          <Text style={styles.label}>First Name</Text>
          <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              value={firstName}
              onChangeText={setFirstName}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              value={lastName}
              onChangeText={setLastName}
          />

          <Text style={styles.label}>Username</Text>
          <TextInput
              style={styles.input}
              placeholder="Enter new username"
              value={username}
              onChangeText={setUsername}
          />

          <Text style={styles.label}>Phone Number</Text>
          <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
              style={styles.input}
              placeholder="Enter new password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
          />

          <TouchableOpacity
              style={styles.saveButton}
              onPress={updateAdminProfile}
              disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    paddingTop: 40,
    color: "#000",
  },
  editableHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#000",
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#000",
  },
  adminIdBox: {
    backgroundColor: "#f1f1f1",  // Grey box background color
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  saveButton: {
    backgroundColor: "#0B7784",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#ccc',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export default AdminProfile;
