import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from 'expo-router'

const vendorAuthForm = () => {
    const navigation = useNavigation();

    useLayoutEffect(() => {
        navigation.setOptions({headerShown: false})
    })
  return (
    <SafeAreaView>
        <View>
            <Text>Vendor Sign Up Fields</Text>
        </View>
    </SafeAreaView>
  )
}

export default vendorAuthForm