import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';

const HomeScreen = () => {

  const pingBackend = async() =>{
    const res = await fetch("http://192.168.1.35:3000");
    const data = await res.text();
    console.log(data)
  }

  return (
    <View>
      <Text>HomeScreen</Text>
      <Pressable style={styles.btn} onPress={pingBackend}>
        <Text style={styles.btnt}>Ping backend</Text>
      </Pressable>
      <Link href={'/(auth)/SignIn'}>
        <Text>
          Go to sign in
        </Text>
      </Link>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  btn:{
    backgroundColor:'black',
    borderRadius:20,
    padding:10,
  },
  btnt:{
    color:'white'
  }
})