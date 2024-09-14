import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Menu, Circle } from 'lucide-react-native';
import SearchSection from './SearchSection';
import AvailableBuses from './AvailableBuses';
import RecentTrips from './RecentTrips';
import MenuModal from './MenuModal';
import { useNavigation } from '@react-navigation/native';

const Homescreen = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showAvailableBuses, setShowAvailableBuses] = useState(false);
  const navigation = useNavigation();

  const handleSearch = () => {
    setShowAvailableBuses(true);
  };

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

      <ScrollView style={styles.content}>
        <SearchSection onSearch={handleSearch} />
        {showAvailableBuses && <AvailableBuses />}
        <RecentTrips />
      </ScrollView>

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
});

export default Homescreen;
