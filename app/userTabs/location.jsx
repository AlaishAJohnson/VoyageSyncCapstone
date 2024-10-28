import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Location = () => {
  return (
    <View style={styles.container}>
      <Text>Location</Text>
    </View>
  )
}

export default Location
const styles = StyleSheet.create({
  container: {
    display: 'flex', 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center'
  }
})