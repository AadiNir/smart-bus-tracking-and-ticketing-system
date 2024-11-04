import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { MapPin, Bus } from 'lucide-react-native';
import DropDownPicker from 'react-native-dropdown-picker';

DropDownPicker.setListMode("SCROLLVIEW");
const SearchSection = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('location');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  useEffect(() => {
    if (fromValue) {
      fetchSuggestions(fromValue, setFromSuggestions);
    } else {
      setFromSuggestions([]);
    }
  }, [fromValue]);

  useEffect(() => {
    if (toValue) {
      fetchSuggestions(toValue, setToSuggestions);
    } else {
      setToSuggestions([]);
    }
  }, [toValue]);

  const fetchSuggestions = async (value, setSuggestions) => {
    try {
      const placesRef = firestore().collection('Places');
      const placeQuery = placesRef
        .where('name', '>=', value)
        .where('name', '<=', value + '\uf8ff')
        .limit(5);
      const placeSnapshot = await placeQuery.get();
      
      const placeNames = placeSnapshot.docs.map(doc => ({
        label: doc.data().name,
        value: doc.data().name
      }));
      setSuggestions(placeNames);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const handleSearch = async () => {
    try {
      if (searchType === 'location') {
        if (fromValue && toValue) {
          const project1Ref = firestore().collection('Project1');
          const busesSnapshot = await project1Ref.get();
  
          const filteredBuses = busesSnapshot.docs
            .filter(doc => {
              const data = doc.data();
              if (!data.Via || typeof data.Via !== 'string') {
                return false; // Skip this document if Via is not defined or not a string
              }
              const via = data.Via.split(',').map(p => p.trim());
              return via.includes(fromValue) && via.includes(toValue);
            })
            .map(doc => {
              const data = doc.data();
              return {
                busNumber: data.bus_number,
                starting_point: data.starting_point,
                ending_point: data.ending_point,
                via: data.Via,
              };
            });
  
          onSearch(filteredBuses);
        } else {
          Alert.alert('Input Required', 'Please enter both FROM and TO locations.');
        }
      } else if (searchType === 'busNumber') {
        const query = firestore().collection('Project1');
        const snapshot = await query.get();
        const buses = snapshot.docs
          .filter(doc => doc.data().bus_number === busNumber)
          .map(doc => {
            const data = doc.data();
            return {
              busNumber: data.bus_number,
              starting_point: data.starting_point,
              ending_point: data.ending_point,
              via: data.Via,
            };
          });
  
        onSearch(buses);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Something went wrong while searching.');
    }
  };

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
            <DropDownPicker
              open={fromOpen}
              value={fromValue}
              items={fromSuggestions}
              setOpen={setFromOpen}
              setValue={setFromValue}
              setItems={setFromSuggestions}
              placeholder="FROM"
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              searchable={true}
              onChangeSearchText={(text) => setFromValue(text)}
              zIndex={3000}
              zIndexInverse={1000}
              showArrowIcon={false}
              searchContainerStyle={{
                width:250,
                borderColor:"#fff"
              }}
              dropDownContainerStyle={{
                width:250,
                backgroundColor:"#fff",
                borderColor:"#fff"
              }}
              
            />
          </View>
          <View style={styles.inputContainer}>
            <MapPin size={20} color="#888" style={styles.inputIcon} />
            <DropDownPicker
              open={toOpen}
              value={toValue}
              items={toSuggestions}
              setOpen={setToOpen}
              setValue={setToValue}
              setItems={setToSuggestions}
              placeholder="TO"
              style={styles.dropdown}
              textStyle={styles.dropdownText}
              searchable={true}
              onChangeSearchText={(text) => setToValue(text)}
              zIndex={2000}
              zIndexInverse={2000}
              showArrowIcon={false}
              searchContainerStyle={{
                width:250,
                borderColor:"#fff"
              }}
              dropDownContainerStyle={{
                width:250,
                backgroundColor:"#fff",
                borderColor:"#fff"
              }}
            />
          </View>
        </>
      ) : (
        <View style={styles.inputContainer}>
          <Bus size={20} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Enter bus number"
            placeholderTextColor="#888"
            value={busNumber}
            onChangeText={setBusNumber}
          />
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSearch}>
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
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#000',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 16,
  },
  dropdown: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderWidth: 0,
    borderRadius: 25,
    width:250
  },
  dropdownText: {
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