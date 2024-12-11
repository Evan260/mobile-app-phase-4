import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function Settings({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('Account')} style={styles.button} activeOpacity={0.7}>
        <View style={styles.accountButtonTextContainer}>
          <Icon name="account" size={24} color="white" style={styles.Icon} />
          <Text style={styles.accountText}>Account</Text>
          <Icon name="arrow-right" size={24} color="white" style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Appearance')} style={styles.button} activeOpacity={0.7}>
        <View style={styles.buttonTextContainer}>
          <Icon name="eye" size={24} color="white" style={styles.Icon} />
          <Text style={styles.text}>Appearance</Text>
          <Icon name="arrow-right" size={24} color="white" style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Privacy')} style={styles.button} activeOpacity={0.7}>
        <View style={styles.buttonTextContainer}>
          <Icon name="lock" size={24} color="white" style={styles.Icon} />
          <Text style={styles.text}>Privacy & Security</Text>
          <Icon name="arrow-right" size={24} color="white" style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Help')} style={styles.button} activeOpacity={0.7}>
        <View style={styles.buttonTextContainer}>
          <Icon name="phone" size={24} color="white" style={styles.Icon} />
          <Text style={styles.text}>Help & Support</Text>
          <Icon name="arrow-right" size={24} color="white" style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('About')} style={styles.button} activeOpacity={0.7}>
        <View style={styles.buttonTextContainer}>
          <Icon name="help-circle" size={24} color="white" style={styles.Icon} />
          <Text style={styles.text}>About</Text>
          <Icon name="arrow-right" size={24} color="white" style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace('Login')} style={styles.LogoutButton} activeOpacity={0.7}>
        <View style={styles.buttonTextContainer}>
          <Icon name="logout" size={24} color="red" style={styles.Icon} />
          <Text style={styles.logOutText}>Log Out</Text>
          <Icon name="arrow-right" size={24} color="red" style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'black',
  },
  button: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
    marginVertical: 8,
    borderBottomWidth: 1,
    borderColor: 'white', 
  },
  LogoutButton: {
    width: '100%',
    padding: 12,
    alignItems: 'center',
    marginVertical: 8,
    borderBottomWidth: 1, 
    borderColor: 'red',
    position: 'relative',
  },
  buttonTextContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountButtonTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  accountText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Inter',
    lineHeight: 24,
    flex: 1,
    textAlign: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Inter',
    lineHeight: 24,
    flex: 1,
    textAlign: 'center',
  },
  Icon: {
    position: 'absolute',
    left: 10,
  },
  logOutText: {
    color: '#ff0000',
    fontSize: 20,
    fontWeight: '500',
    fontFamily: 'Inter',
    lineHeight: 24,
    flex: 1,
    textAlign: 'center',
  },
});

export default Settings;
