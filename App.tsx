import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Homescreen from './components/Homescreen';
import BusDetails from './components/BusDetails';
import { BleManager } from 'react-native-ble-plx';
import notifee, { EventType } from '@notifee/react-native';
import { PermissionsAndroid, Platform, AppState } from 'react-native';
import Tts from 'react-native-tts';

const manager = new BleManager();
const Stack = createStackNavigator();


const busInfo = {
  'boAt Rockerz 255 Pro+-GFP': {
    busNumber: '24A',
    from: 'V House',
    to: 'Anna Nagar West',
  },
};

const App = () => {
  const [notificationTriggered, setNotificationTriggered] = useState(new Set()); // Track triggered notifications
  const [appState, setAppState] = useState(AppState.currentState);
  const navigationRef = useRef();
  const isScanning = useRef(false); // Track scanning status

  useEffect(() => {
    const setupBluetooth = async () => {
      console.log('Setting up Bluetooth...');
      const subscription = manager.onStateChange((state) => {
        if (state === 'PoweredOn') {
          console.log('Bluetooth is PoweredOn');
          subscription.remove();  // Remove listener once Bluetooth is powered on
          requestPermissions().then((granted) => {
            if (granted) {
              console.log('Permissions granted, starting scan...');
              startBackgroundScanning();  // Start scanning
            } else {
              console.log('Permissions not granted');
            }
          });
        } else {
          console.log(`Bluetooth state: ${state}`);
        }
      }, true);
    };

    setupBluetooth();

    // Set up notification listener
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.notification) {
        const busNumber = detail.notification.data?.busNumber;
        if (busNumber) {
          console.log('Navigating to BusDetails screen with bus number:', busNumber);
          navigationRef.current?.navigate('BusDetails', { busNumber });
        }
      }
    });

   
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground, restarting scan if needed...');
        if (notificationTriggered.size === 0) {
          startBackgroundScanning();  
        }
      }
      setAppState(nextAppState);
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

   
    return () => {
      unsubscribe();
      appStateSubscription.remove();  
      if (isScanning.current) {
        manager.stopDeviceScan().catch((error) => {
          console.log('Error stopping device scan:', error);
        });
      }
     
      if (manager) {
        manager.destroy().catch((error) => {
          console.log('Error destroying BleManager:', error);
        });
      }
    };
  }, [appState, notificationTriggered]);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        const result = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        console.log('Permissions result:', result);
        return Object.values(result).every((r) => r === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        console.log('Fine location permission result:', result);
        return result === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true;
  };

  const triggerNotification = async (deviceName) => {
    const bus = busInfo[deviceName];
    if (!bus) {
      console.log(`No bus information found for device name: ${deviceName}`);
      return;
    }
  
    await notifee.requestPermission();
  
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
  
    console.log('Triggering notification for bus:', bus);
  
    // Triggering text-to-speech
    const speechText = `Bus ${bus.busNumber} from ${bus.from} to ${bus.to} is nearby.`;
    Tts.speak(speechText);
    await notifee.displayNotification({
      title: `Bus ${bus.busNumber} Detected!`,
      body: `From: ${bus.from} To: ${bus.to}`,
      android: {
        channelId,
        smallIcon: 'ic_launcher', 
        pressAction: {
          id: 'default',
        },
      },
      data: {
        busNumber: bus.busNumber,
      },
    });
  
   
    setNotificationTriggered(prev => new Set(prev).add(deviceName));
  };
    

  const startBackgroundScanning = () => {
    const scanAndProcess = () => {
      console.log('Starting BLE scan...');
      isScanning.current = true; // Set scanning status to true
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log('Scan error:', error);
          return;
        }


        console.log('Found device:', device.name);

   
        const deviceName = device.name;
        console.log('Device name:', deviceName); // Log device name
        if (busInfo[deviceName] && !notificationTriggered.has(deviceName)) {
          console.log('Bus detected, triggering notification for:', deviceName);
          manager.stopDeviceScan().catch((error) => {
            console.log('Error stopping device scan:', error);
          }); 
          triggerNotification(deviceName); 
        } else {
          console.log('No matching bus info or notification already triggered.');
        }
      });

      
      setTimeout(() => {
        if (isScanning.current) { 
          console.log('Stopping BLE scan after 10 seconds');
          isScanning.current = false;
          manager.stopDeviceScan().catch((error) => {
            console.log('Error stopping device scan:', error);
          });
        }
      }, 10000);
    };

    
    scanAndProcess();

    
    const intervalId = setInterval(() => {
      if (notificationTriggered.size === 0) {
        scanAndProcess();
      } else {
        clearInterval(intervalId); 
      }
    }, 15000);

   
    return () => clearInterval(intervalId);
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Homescreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BusDetails"
          component={BusDetails}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
