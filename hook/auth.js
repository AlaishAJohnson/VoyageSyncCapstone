import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const saveUserData = async (userData) => {
  try {
    await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
  } catch (error) {
    console.error('Failed to save user data:', error);
  }
};

const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('@user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to load user data:', error);
  }
};

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    name: '',
  });
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    const loadUserData = async () => {
      const savedUserData = await getUserData();
      if (savedUserData) {
        setUserData(savedUserData);
        setUserRole(savedUserData.role); 
        setIsAuthenticated(true);
        console.log('Loaded user data from AsyncStorage:', savedUserData);
      }
      setLoading(false); 
    };
    loadUserData();
  }, []);

 
  if (loading) {
    return null;  
  }

  const updateUserData = (newData) => {
    setUserData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const login = async (userData) => {
    await saveUserData(userData); 
    setUserData(userData);         
    setUserRole(userData.role);    
    setIsAuthenticated(true);     
  };

  const logout = async () => {
    await AsyncStorage.removeItem('@user_data');
    setUserData(null);
    setIsAuthenticated(false);
  };

  const createUser = async (userData) => {
    await saveUserData(userData);
  
    setUserData(userData);
    setUserRole(userData.role); 
    setIsAuthenticated(true);  
    console.log('User created and authenticated:', userData);
  };
  

  return (
    <AuthContext.Provider
      value={{
        userData,
        userRole,
        isAuthenticated,
        updateUserData,
        login,           
        logout,
        createUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
