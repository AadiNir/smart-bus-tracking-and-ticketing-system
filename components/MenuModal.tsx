import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, Ticket, CreditCard } from 'lucide-react-native';

const MenuModal = ({ showMenu, setShowMenu }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={showMenu}
    onRequestClose={() => setShowMenu(false)}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Menu</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Bell size={24} color="#4a0e8f" />
          <Text style={styles.menuItemText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ticket size={24} color="#4a0e8f" />
          <Text style={styles.menuItemText}>Booked Tickets</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <CreditCard size={24} color="#4a0e8f" />
          <Text style={styles.menuItemText}>Transaction History</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowMenu(false)}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
   
      modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
      modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
      },
      modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
      },
      closeText: {
        color: '#4a0e8f',
        marginTop: 12,
        fontWeight: 'bold',
      },
      menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      },
      menuItemText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#4a0e8f',
      },
    
});

export default MenuModal;
