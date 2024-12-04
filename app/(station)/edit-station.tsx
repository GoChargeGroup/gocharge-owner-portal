import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { editStation } from '@/lib/authService';
import CustomAlert from '@/components/CustomAlert';
import { useGlobalContext } from '@/context/GlobalProvider';

const EditStation = () => {
  const { station } = useLocalSearchParams();
  const stationData = JSON.parse(station);
  const { getCallback } = useGlobalContext(); 
  const onStationEdited = getCallback('onStationEdited'); 

  const [name, setName] = useState(stationData.name || '');
  const [description, setDescription] = useState(stationData.description || '');
  const [address, setAddress] = useState(stationData.address || '');
  const [latitude, setLatitude] = useState(
    stationData.coordinates && stationData.coordinates[1] !== undefined
      ? stationData.coordinates[1].toString()
      : ''
  );
  const [longitude, setLongitude] = useState(
    stationData.coordinates && stationData.coordinates[0] !== undefined
      ? stationData.coordinates[0].toString()
      : ''
  );
  
  const [operationalHours, setOperationalHours] = useState(
    stationData.operational_hours || Array(7).fill([0, 0])
  );
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', actions: [] });

  const router = useRouter();

  const showAlert = (title, message, actions = []) => {
    setAlert({ visible: true, title, message, actions });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  const validateFields = () => {
    if (!name || name.length > 255) {
      return 'Name is required and should not exceed 255 characters.';
    }
    if (!description || description.length > 255) {
      return 'Description is required and should not exceed 255 characters.';
    }
    if (!address || address.length > 255) {
      return 'Address is required and should not exceed 255 characters.';
    }
    const latitudeNum = parseFloat(latitude);
    const longitudeNum = parseFloat(longitude);

    if (isNaN(latitudeNum) || latitudeNum < -90 || latitudeNum > 90) {
      return 'Latitude must be a number between -90 and 90.';
    }
    if (isNaN(longitudeNum) || longitudeNum < -180 || longitudeNum > 180) {
      return 'Longitude must be a number between -180 and 180.';
    }

    for (let i = 0; i < operationalHours.length; i++) {
      if (
        !Number.isInteger(operationalHours[i][0]) ||
        !Number.isInteger(operationalHours[i][1]) ||
        operationalHours[i][0] < 0 ||
        operationalHours[i][1] < 0
      ) {
        return `Operational hours for Day ${i + 1} must be valid integers greater than or equal to 0.`;
      }
    }
    return null;
  };

  const handleSave = async () => {
    const error = validateFields();
    if (error) {
      showAlert('Validation Error', error);
      return;
    }

    try {
      const updatedStation = {
        _id: stationData._id,
        name,
        description,
        address,
        operational_hours: operationalHours,
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };

      console.log('Saving station:', updatedStation);
      await editStation(updatedStation);
      
      if (onStationEdited) {
        onStationEdited(updatedStation); // Trigger the callback
      }

      showAlert('Success', 'Station updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            handleCloseAlert();
            router.back(); 
          },
        },
      ]);
    } catch (error) {
      console.error('Error saving station:', error);
      showAlert('Error', 'Failed to save station. Please try again.');
    }
  };

  const handleOperationalHoursChange = (dayIndex, hourIndex, value) => {
    const updatedHours = [...operationalHours];
    updatedHours[dayIndex][hourIndex] = parseInt(value, 10) || 0;
    setOperationalHours(updatedHours);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Station</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Longitude" // thats how
        value={latitude}
        onChangeText={setLatitude}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Latitude" // i know
        value={longitude}
        onChangeText={setLongitude}
        keyboardType="numeric"
      />

      <Text style={styles.sectionTitle}>Operational Hours</Text>
      {operationalHours.map((day, dayIndex) => (
        <View key={dayIndex} style={styles.operationalHoursRow}>
          <Text style={styles.dayLabel}>Day {dayIndex + 1}:</Text>
          <TextInput
            style={[styles.input, styles.hourInput]}
            placeholder="Open"
            value={String(day[0])}
            keyboardType="numeric"
            onChangeText={(value) => handleOperationalHoursChange(dayIndex, 0, value)}
          />
          <TextInput
            style={[styles.input, styles.hourInput]}
            placeholder="Close"
            value={String(day[1])}
            keyboardType="numeric"
            onChangeText={(value) => handleOperationalHoursChange(dayIndex, 1, value)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={handleCloseAlert}
        actions={alert.actions}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  operationalHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  hourInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditStation;
