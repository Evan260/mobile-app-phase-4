import { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const AppearanceScreen = () => {
  const [theme, setTheme] = useState('dark'); 

  const isDarkMode = theme === 'dark';

  const handleSetDarkMode = () => setTheme('dark');
  const handleSetLightMode = () => setTheme('light');

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#000000' : '#ffffff' }, 
      ]}
    >
      <Text style={[styles.title, { color: isDarkMode ? '#f0f0f0' : '#000000' }]}>
        Choose Theme
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Dark Mode" onPress={handleSetDarkMode} color="orange" />
        <Button title="Light Mode" onPress={handleSetLightMode} color="#555555" />
      </View>
      <Text style={[styles.selectedTheme, { color: isDarkMode ? '#f0f0f0' : '#000000' }]}>
        Selected Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    gap: 20,
  },
  selectedTheme: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default AppearanceScreen;
