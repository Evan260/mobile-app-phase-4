import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const About = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yet Another Calculator</Text>
      <Text style={styles.version}>Version 1.0</Text>
      <Text style={styles.releaseDate}>Release Date: 16 Dec 2024</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ffffff",
  },
  version: {
    fontSize: 18,
    color: "#f5f5f5",
  },
  releaseDate: {
    fontSize: 16,
    color: "yellow",
    marginTop: 5,
  },
});

export default About;
