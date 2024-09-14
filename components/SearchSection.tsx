import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MapPin, Bus } from 'lucide-react-native';

const SearchSection = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('location');

  return (
    <View style={styles.searchContainer}>
      <Text style={styles.title}>Choose your search method:</Text>
      
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleButton, searchType === 'location' && styles.activeToggle]}
          onPress={() => setSearchType('location')}
        >
          <Text style={[styles.toggleText, searchType === 'location' && styles.activeToggleText]}>By Location</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, searchType === 'busNumber' && styles.activeToggle]}
          onPress={() => setSearchType('busNumber')}
        >
          <Text style={[styles.toggleText, searchType === 'busNumber' && styles.activeToggleText]}>By Bus Number</Text>
        </TouchableOpacity>
      </View>

      {searchType === 'location' ? (
        <>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#888" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="FROM" placeholderTextColor="#888" />
          </View>
          
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#888" style={styles.inputIcon} />
            <TextInput style={styles.input} placeholder="TO" placeholderTextColor="#888" />
          </View>
        </>
      ) : (
        <View style={styles.inputContainer}>
          <Bus size={20} color="#888" style={styles.inputIcon} />
          <TextInput style={styles.input} placeholder="Enter bus number" placeholderTextColor="#888" />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={onSearch}>
        <Text style={styles.buttonText}>Search Buses</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#4a0e8f'
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeToggle: {
    backgroundColor: '#6a3abc',
  },
  toggleText: {
    color: '#888',
    fontWeight: 'bold',
  },
  activeToggleText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#000',
  },
  button: {
    backgroundColor: '#6a3abc',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default SearchSection;