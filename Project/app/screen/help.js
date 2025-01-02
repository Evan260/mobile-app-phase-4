import { View, Text, StyleSheet } from 'react-native';

const Help = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.supportText}>Contact for Support:</Text>
      <Text style={styles.contactNumber}>+1 800 000 0000</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffffff', 
  },
  supportText: {
    fontSize: 28,
    color: '#ffffff',
  },
  contactNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 10,
  },
});

export default Help;
