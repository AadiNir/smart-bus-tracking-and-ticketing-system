import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList } from 'react-native';
import { Bus, IndianRupee, MapPin, ChevronDown } from 'lucide-react-native';
import firestore from '@react-native-firebase/firestore';

const CustomDropdown = ({ options, selectedValue, onSelect, placeholder }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {selectedValue || placeholder}
        </Text>
        <ChevronDown size={20} color="#4a0e8f" />
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onSelect(item.place);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.optionText}>
                    {item.place}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.place}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const BusDetails = ({ route }) => {
  const { busNumber, userId } = route.params;
  const [busData, setBusData] = useState(null);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [numTickets, setNumTickets] = useState(1);
  const [viaOptions, setViaOptions] = useState([]);
  const [locationCounts, setLocationCounts] = useState([]);

  useEffect(() => {
    const fetchBusData = async () => {
      try {
        const busDoc = await firestore()
          .collection('Project1')
          .where('bus_number', '==', busNumber)
          .get();

        if (!busDoc.empty) {
          const data = busDoc.docs[0].data();
          setBusData(data);
          
          const viaStops = data.Via ? data.Via.split(', ') : [];
          const allStops = [
            data.starting_point,
            ...viaStops,
            data.ending_point
          ].filter(Boolean);
          
          // Fetch counts for each stop
          const optionsWithCounts = await Promise.all(
            allStops.map(async (stop) => {
              const stopDoc = await firestore().collection('24A').where('place', '==', stop).get();
              const count = stopDoc.empty ? 0 : stopDoc.docs[0].data().count;
              return { place: stop, count };
            })
          );

          setViaOptions(optionsWithCounts);
          setLocationCounts(optionsWithCounts); // Set counts for the horizontal scrollable section
          setFromLocation(data.starting_point);
          setToLocation(data.ending_point);
        } else {
          console.log('No matching bus found');
        }
      } catch (error) {
        console.error('Error fetching bus data:', error);
      }
    };

    fetchBusData();
  }, [busNumber]);

  const incrementTickets = () => setNumTickets(prev => prev + 1);
  const decrementTickets = () => setNumTickets(prev => (prev > 1 ? prev - 1 : 1));

  const handleBooking = async () => {
    try {
      const busRef = firestore().collection('24A');
      const busRoutesRef = firestore().collection('BusRoutes');
  
      // Get the current stop's order
      const fromStopSnapshot = await busRef.where('place', '==', fromLocation).get();
      if (fromStopSnapshot.empty) {
        console.error('From location not found');
        return;
      }
      
      const currentStopOrder = fromStopSnapshot.docs[0].data().stop_order;
      
      // Get the previous stop using stop_order
      const previousStopSnapshot = await busRef
        .where('stop_order', '==', currentStopOrder - 1)
        .get();
  
      if (!previousStopSnapshot.empty) {
        const previousStop = previousStopSnapshot.docs[0];
        
        // Get all bookings where 'from' matches the previous stop's place
        const previousStopBookings = await busRoutesRef
          .where('from', '==', previousStop.data().place)
          .get();
  
        if (!previousStopBookings.empty) {
          // Convert booking times to minutes and calculate average
          const bookingTimes = previousStopBookings.docs.map(doc => {
            const timeStr = doc.data().booking_time;
            return convertTimeToMinutes(timeStr);
          });
  
          const averageMinutes = Math.round(
            bookingTimes.reduce((acc, minutes) => acc + minutes, 0) / bookingTimes.length
          );
  
          // Convert average minutes back to time string
          const newArrivalTime = convertMinutesToTimeString(averageMinutes);
  
          // Update the previous stop's arrival time
          await previousStop.ref.update({
            arrivalTime: newArrivalTime
          });
        }
      }
  
      // Proceed with original booking logic
      const toQuerySnapshot = await busRef.where('place', '==', toLocation).get();
  
      if (toQuerySnapshot.empty) {
        console.error('Destination location does not exist in the database');
        return;
      }
  
      const fromDocRef = fromStopSnapshot.docs[0].ref;
      const toDocRef = toQuerySnapshot.docs[0].ref;
  
      // Update counts
      await fromDocRef.update({ count: 0 });
      await toDocRef.update({ 
        count: firestore.FieldValue.increment(numTickets) 
      });
  
      // Add booking details
      const bookingData = {
        bus_no: busNumber,
        from: fromLocation,
        to: toLocation,
        booking_date: new Date().toLocaleDateString(),
        booking_time: new Date().toLocaleTimeString(),
      };
  
      await busRoutesRef.add(bookingData);
  
      console.log('Booking completed successfully');
  
    } catch (error) {
      console.error('Error in handleBooking:', error);
    }
  };
  
  // Helper function to convert time string (e.g., "08:30 AM") to minutes since midnight
  const convertTimeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    
    return hours * 60 + minutes;
  };
  
  // Helper function to convert minutes since midnight to time string
  const convertMinutesToTimeString = (minutes) => {
    let hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${period}`;
  };
  
  
  if (!busData) {
    return <View style={styles.container}><Text style={styles.loadingText}>Loading...</Text></View>;
  }

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
            <Text style={styles.routeText}>{busData.starting_point}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routePoint}>
            <MapPin size={24} color="#4a0e8f" />
            <Text style={styles.routeText}>{busData.ending_point}</Text>
          </View>
        </View>

        {/* Horizontal Scrollable View for Location Counts */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.countsContainer}>
          {locationCounts.map((item, index) => (
            <View key={index} style={styles.countItem}>
              <Text style={styles.countText}>{item.place}</Text>
              <Text style={styles.countValue}>Count: {item.count}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>From:</Text>
            <CustomDropdown
              options={viaOptions}
              selectedValue={fromLocation}
              onSelect={setFromLocation}
              placeholder="Select starting point"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>To:</Text>
            <CustomDropdown
              options={viaOptions}
              selectedValue={toLocation}
              onSelect={setToLocation}
              placeholder="Select destination"
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

      <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
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
  countsContainer: {
    marginVertical: 10,
  },
  countItem: {
    alignItems: 'center',
    backgroundColor: '#f0e6ff',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  countText: {
    color: '#4a0e8f',
    fontWeight: 'bold',
  },
  countValue: {
    color: '#4a0e8f',
    fontSize: 14,
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
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: '#4a0e8f',
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4a0e8f',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f0e6ff',
  },
  dropdownButtonText: {
    color: '#4a0e8f',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
    color: '#4a0e8f',
  },
  ticketContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  ticketLabel: {
    color: '#4a0e8f',
    fontSize: 16,
    fontWeight: 'bold',
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
    color: '#4a0e8f',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
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
  loadingText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BusDetails;