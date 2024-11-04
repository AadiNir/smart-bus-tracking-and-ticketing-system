import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { Menu, Circle } from 'lucide-react-native';
import SearchSection from './SearchSection';
import AvailableBuses from './AvailableBuses';
import RecentTrips from './RecentTrips';
import MenuModal from './MenuModal';
import { useNavigation } from '@react-navigation/native';

const Homescreen = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAvailableBuses, setShowAvailableBuses] = useState(false);
  const [buses, setBuses] = useState([]);
  const navigation = useNavigation();

  const handleSearch = (fetchedBuses) => {
    setBuses(fetchedBuses);
    setShowAvailableBuses(fetchedBuses.length > 0);
  };

  const renderHeader = () => (
    <>
      <SearchSection onSearch={handleSearch} />
      {showAvailableBuses ? (
        <AvailableBuses buses={buses} />
      ) : (
        <Text style={styles.noBusesText}>No buses available. Try a different search.</Text>
      )}
      <RecentTrips />
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowMenu(true)}>
          <Menu size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Circle size={40} color="#fff" />
        </View>
      </View>

      <FlatList
        data={[]} // We're using FlatList as a scrollable container
        renderItem={null}
        ListHeaderComponent={renderHeader}
        style={styles.content}
        keyboardShouldPersistTaps="handled"
      />

      <MenuModal showMenu={showMenu} setShowMenu={setShowMenu} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4a0e8f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#3a0b70',
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  noBusesText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Homescreen;