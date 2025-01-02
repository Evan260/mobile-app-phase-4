import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Switch } from 'react-native';

const Privacy = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [noLogging, setNoLogging] = useState(false);
  const [noAnalytics, setNoAnalytics] = useState(false);

  const handleConfirmChange = (type) => {
    setConfirmationMessage(`${type} has been updated successfully.`);
    setTimeout(() => setConfirmationMessage(''), 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security Settings</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Change Password:</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          placeholder="Enter new password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
        />
        <Button title="Change Password" onPress={() => handleConfirmChange('Password')} color="#4CAF50" />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Change Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter new email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <Button title="Change Email" onPress={() => handleConfirmChange('Email')} color="#4CAF50" />
      </View>

      <Text style={styles.privacyTitle}>Privacy Settings</Text>

      <View style={styles.privacySetting}>
        <Text style={styles.label}>Logging of Answers:</Text>
        <Switch value={noLogging} onValueChange={setNoLogging} trackColor={{ false: '#767577', true: '#4CAF50' }} thumbColor={noLogging ? '#4CAF50' : '#f4f3f4'} />
      </View>

      <View style={styles.privacySetting}>
        <Text style={styles.label}>Sending Back Data for Analytics:</Text>
        <Switch value={noAnalytics} onValueChange={setNoAnalytics} trackColor={{ false: '#767577', true: '#4CAF50' }} thumbColor={noAnalytics ? '#4CAF50' : '#f4f3f4'} />
      </View>

      {confirmationMessage ? (
        <Text style={styles.confirmation}>{confirmationMessage}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#ffffff",
  },
  privacyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
    textAlign: "center",
    color: "#ffffff",
  },
  inputGroup: {
    marginBottom: 20,
  },
  privacySetting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#ffffff",
  },
  input: {
    height: 40,
    borderColor: "#444",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#1E1E1E",
    color: "#ffffff",
  },
  confirmation: {
    marginTop: 20,
    fontSize: 16,
    color: "#4CAF50",
    textAlign: "center",
  },
});

export default Privacy;
