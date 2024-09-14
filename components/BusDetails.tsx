import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Bus, IndianRupee, MapPin } from 'lucide-react-native';

const BusDetails = ({ route }) => {
  const { busNumber } = route.params;

  const [fromLocation, setFromLocation] = useState('Location A');
  const [toLocation, setToLocation] = useState('Location B');
  const [numTickets, setNumTickets] = useState(1);

  const startPoint = 'City Center';
  const endPoint = 'Main Station';

  const incrementTickets = () => setNumTickets(prev => prev + 1);
  const decrementTickets = () => setNumTickets(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Bus size={40} color="#fff" />
        <Text style={styles.title}>Bus {busNumber}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.routeContainer}>
          <View style={styles.routePoint}>
            <MapPin size={24} color="#4a0e8f" />
            <Text style={styles.routeText}>{startPoint}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <MapPin size={24} color="#4a0e8f" />
            <Text style={styles.routeText}>{endPoint}</Text>
          </View>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>From:</Text>
            <TextInput
              style={styles.input}
              value={fromLocation}
              onChangeText={setFromLocation}
              placeholder="Enter start location"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>To:</Text>
            <TextInput
              style={styles.input}
              value={toLocation}
              onChangeText={setToLocation}
              placeholder="Enter destination"
            />
          </View>
        </View>

        <View style={styles.ticketContainer}>
          <Text style={styles.ticketLabel}>Number of Tickets:</Text>
          <View style={styles.ticketControls}>
            <TouchableOpacity style={styles.ticketButton} onPress={decrementTickets}>
              <Text style={styles.ticketButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.ticketCount}>{numTickets}</Text>
            <TouchableOpacity style={styles.ticketButton} onPress={incrementTickets}>
              <Text style={styles.ticketButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoContainer}>
         
          <View style={styles.infoItem}>
            <IndianRupee size={20} color="#4a0e8f" />
            <Text style={styles.infoText}>Fare: Rs{20 * numTickets}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.bookButton} onPress={() => alert('Booking feature to be implemented')}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a0e8f',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  routeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  routePoint: {
    alignItems: 'center',
  },
  routeLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#4a0e8f',
    marginHorizontal: 10,
  },
  routeText: {
    color: '#4a0e8f',
    fontWeight: 'bold',
    marginTop: 5,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 15,
    marginRight: 10, // Add marginRight for space between the two inputs
  },
  inputLabel: {
    color: '#333',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  ticketContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  ticketLabel: {
    color: '#333',
    fontSize: 16,
  },
  ticketControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketButton: {
    backgroundColor: '#4a0e8f',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ticketCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a0e8f',
    marginHorizontal: 15,
  },
  infoContainer: {
    marginTop: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    color: '#333',
    fontSize: 16,
    marginLeft: 10,
  },
  bookButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#4a0e8f',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BusDetails;
