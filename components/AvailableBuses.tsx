import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Bus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const AvailableBuses = ({ buses }) => {
  const navigation = useNavigation();

  return (
    <View>
      <Text style={styles.sectionTitle}>Available Buses</Text>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.busOptionsContainer}>
          {buses.length > 0 ? buses.map((bus, index) => (
            <TouchableOpacity
              key={index}
              style={styles.busOption}
              onPress={() => navigation.navigate('BusDetails', { busNumber: bus.busNumber })}
            >
              <View style={styles.busIconContainer}>
                <Bus size={30} color="#fff" />
              </View>
              <Text style={styles.busText}>Bus {bus.busNumber}</Text>
              
            </TouchableOpacity>
          )) : (
            <Text style={styles.noBusesText}>No buses available</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  busOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'nowrap', // Ensure no wrapping
    alignItems: 'center',
  },
  busOption: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 12,
    width: 100, // Adjust width as needed
    marginRight: 10, // Add space between items
    marginBottom:15
  },
  busIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  busText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  busSubText: {
    color: '#ccc',
    fontSize: 12,
  },
  noBusesText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default AvailableBuses;
