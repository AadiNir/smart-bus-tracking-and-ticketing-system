import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RecentTrips = () => (
  <View>
    <Text style={styles.sectionTitle}>Recent Trips</Text>
    <View style={styles.recentTripsContainer}>
      {[1, 2].map((item) => (
        <View key={item} style={styles.recentTrip}>
          <View>
            <Text style={styles.recentTripRoute}>Route A to B</Text>
            <Text style={styles.recentTripDate}>May {item}, 2024</Text>
          </View>
          <TouchableOpacity style={styles.recentTripButton}>
            <Text style={styles.recentTripButtonText}>Book Again</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  recentTripsContainer: {
    marginBottom: 20,
  },
  recentTrip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  recentTripRoute: {
    color: '#fff',
    fontWeight: 'bold',
  },
  recentTripDate: {
    color: '#ccc',
  },
  recentTripButton: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  recentTripButtonText: {
    color: '#4a0e8f',
    fontWeight: 'bold',
  }
  
});

export default RecentTrips;
