  
  
import React, { useState } from 'react';
import { Button, TextInput, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const Login = ({ route }) => {
  const [userId, setUserId] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const addUserToFirestore = async (userId: string, username: string, password: string) => {
    try {
      const userRef = firestore().collection('user');
      await userRef.doc(userId).set({
        username: username,
        password: password,
      });
      console.log(`User ${username} added successfully with userId: ${userId}`);
    } catch (error) {
      console.error('Error adding user to Firestore:', error);
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
        placeholder="Username"
        placeholderTextColor="#ccc"
        value={username}
        onChangeText={setUsername}
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
        onPress={() => addUserToFirestore(userId, username, password)}
      >
        <Text style={styles.buttonText}>Register</Text>
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
    backgroundColor: '#4CAF50', // You can replace with a theme-based color
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

export default Login;
