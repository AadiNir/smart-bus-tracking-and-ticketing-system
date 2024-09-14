import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bus } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const AvailableBuses = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text style={styles.sectionTitle}>Available Buses</Text>
      <View style={styles.busOptionsContainer}>
        {[1, 2, 3].map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.busOption}
            onPress={() => navigation.navigate('BusDetails', { busNumber: item })}
          >
            <View style={styles.busIconContainer}>
              <Bus size={30} color="#fff" />
            </View>
            <Text style={styles.busText}>Bus {item}</Text>
            <Text style={styles.busSubText}>$20 • 30 min</Text>
          </TouchableOpacity>
        ))}
      </View>
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
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  busOption: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    padding: 12,
    width: '30%',
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
});

export default AvailableBuses;
