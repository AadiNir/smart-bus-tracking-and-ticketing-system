import React, { useState } from 'react';
import { Button, TextInput, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Signup = ({ route }) => {
    const [busNumberid]=route.params;
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for loading feedback

  const checkUserCredentials = async (userId: string, password: string) => {
    setLoading(true); // Start loading
    try {
      const userRef = firestore().collection('user').doc(userId);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        if (userData?.password === password) {
          // Successful login
          Alert.alert('Success', `Login successful! ${busNumberid}`);
        } else {
          Alert.alert('Error', 'Incorrect password. Please try again.');
        }
      } else {
        Alert.alert('Error', 'User does not exist. Please check your User ID.');
      }
    } catch (error) {
      console.error('Error checking user credentials:', error);
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="User ID"
        placeholderTextColor="#ccc"
        value={userId}
        onChangeText={setUserId}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ccc"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => checkUserCredentials(userId, password)}
        disabled={loading} // Disable button while loading
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Login'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c', // Dark background for theme
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Signup;
