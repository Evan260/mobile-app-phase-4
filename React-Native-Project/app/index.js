import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Link, useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const logoImg = require("C:/Final Project/mobile-app-phase-4/React-Native-Project/assets/Yet-Another-Calculator.png")

const Index = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <Image style={styles.image} source={logoImg}/>
          <Text style={styles.title}> Yet Another Calculator</Text> 
          <View style={styles.userName}>
            <TextInput
            style={styles.userNameText}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            />
          </View>
          <View style={styles.userName}>
            <TextInput
            style={styles.userNameText}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate("(drawer)")}> Login
            </TouchableOpacity>
          </View>
        </View>
      </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
      display: 'flex',
      padding: 84,
      alignItems: 'center',
      gap: 30,
      backgroundColor: 'black',
  },
  subContainer:{
    width: 396,
    height: 852,
    paddingRight: 10,
    paddingBottom: 239,
    paddingLeft: 10, 
    flexDirection: 'column',
    alignItems: 'center',
    gap: 30,
  },
  title: {
      color: 'white',
      fontFamily: 'Inter',
      fontSize: 25,
      fontStyle: 'normal',
      fontWeight: '900',
      lineHeight: 28,
  },
  userName: {
      width: 362.176,
      height: 46.235,
      paddingVertical: 7.706,
      paddingHorizontal: 15.412,
      alignItems: 'center',
      borderRadius: 46.235,
      backgroundColor: 'white',
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  userNameText: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "#333",
  },
  Button: {
      height: 46.235,
      paddingTop: 13.871,
      paddingLeft: 160,
      paddingRight: 160,
      paddingBottom: 7.706,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 46.235,
      backgroundColor: '#506AE1',
      color: 'white',
  },
  input: {
      width: '100%',
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 10,
      borderRadius: 5,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    flexShrink: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 50,
    elevation: 10,
  },
});
