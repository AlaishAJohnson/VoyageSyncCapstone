import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SystemSettings = () => {
  return (
    <View style={styles.container}>
      <Text>SystemSettings</Text>
    </View>
  )
}

export default SystemSettings

const styles = StyleSheet.create({
  container: {
    display: 'flex', 
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'center'
  }
})