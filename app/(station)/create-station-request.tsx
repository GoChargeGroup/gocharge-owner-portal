import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { addStationRequest } from '@/lib/authService';
import CustomAlert from '@/components/CustomAlert';

const CreateStationRequest = () => {
  const router = useRouter();

  // State for form inputs
  const [form, setForm] = useState({
    name: '',
    description: '',
    coordinates: '', // This will be a string input for now
    operationalHours: '',
    address: '',
  });

  // CustomAlert state
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertActions, setAlertActions] = useState([]);

  // Function to show the custom alert with specified content and actions
  const showCustomAlert = (title, message, actions = [{ text: 'OK', onPress: () => setAlertVisible(false) }]) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertActions(actions);
    setAlertVisible(true);
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.description || !form.coordinates || !form.address) {
      showCustomAlert('Missing Fields', 'Please fill out all required fields.');
      return;
    }

    // Parse coordinates as a float array
    const parsedCoordinates = form.coordinates.split(',').map(coord => parseFloat(coord.trim()));
    if (parsedCoordinates.length !== 2 || parsedCoordinates.some(isNaN)) {
      showCustomAlert('Invalid Input', 'Please enter valid coordinates as "latitude, longitude".');
      return;
    }

    try {
      const stationData = { ...form, coordinates: parsedCoordinates }; // Replace coordinates with parsed array
      console.log(stationData);
      await addStationRequest(stationData);
      showCustomAlert('Success', 'Station added successfully!', [
        { text: 'OK', onPress: () => { setAlertVisible(false); router.push('(station)/station-main'); } }
      ]);
    } catch (error) {
      showCustomAlert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add a New Charging Station</Text>

      <TextInput
        style={styles.input}
        placeholder="Station Name"
        value={form.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={form.description}
        onChangeText={(text) => handleInputChange('description', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={form.address}
        onChangeText={(text) => handleInputChange('address', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Coordinates (e.g., 45.123, -93.456)"
        value={form.coordinates}
        onChangeText={(text) => handleInputChange('coordinates', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Operational Hours (e.g., 9 AM - 5 PM)"
        value={form.operationalHours}
        onChangeText={(text) => handleInputChange('operationalHours', text)}
      />

      <Button title="Submit Station" onPress={handleSubmit} />

      {/* Render CustomAlert */}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
        actions={alertActions}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
});

export default CreateStationRequest;
