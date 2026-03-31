import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { useAuth } from '@/contexts/auth-contexts';

const HomeScreen = () => {

  const pingBackend = async() =>{
    const res = await fetch("http://192.168.1.35:3000");
    const data = await res.text();
    console.log(data)
  }

  const {signOut} = useAuth()
  return (
    <View>
      <Pressable onPress={()=>signOut()}>
        <Text>Sign out</Text>
      </Pressable>
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