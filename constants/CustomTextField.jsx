import React from 'react';
import { TextInput, StyleSheet, View } from 'react-native';

const CustomTextField = ({ value, onChangeText, placeholder }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    padding: 15,
    height: 60,
    textAlign: 'center',
    backgroundColor: 'rgba(11, 119, 132, 0.5)', // MainColor with 0.5 opacity
    borderRadius: 20,
    color: '#fff',
  },
});

export default CustomTextField;
