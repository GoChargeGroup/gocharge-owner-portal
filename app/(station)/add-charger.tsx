import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { addCharger } from '@/lib/authService';
import CustomAlert from '@/components/CustomAlert';

const AddCharger = () => {
  const { station_id } = useLocalSearchParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [kWhType, setKWhType] = useState('');
  const [chargerType, setChargerType] = useState('');
  const [price, setPrice] = useState('');
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
    if (!kWhType || kWhType.length > 255) {
      return 'kWh Type is required and should not exceed 255 characters.';
    }
    if (!chargerType || chargerType.length > 255) {
      return 'Charger Type is required and should not exceed 255 characters.';
    }
    if (!price || !/^\d+$/.test(price)) {
      return 'Price is required and should be a valid integer.';
    }
    return null;
  };

  const handleAddCharger = async () => {
    const error = validateFields();
    if (error) {
      showAlert('Validation Error', error);
      return;
    }

    try {
      const chargerData = {
        station_id,
        name,
        description,
        kWh_types_id: kWhType,
        charger_types_id: chargerType,
        price: parseInt(price, 10),
      };

      await addCharger(chargerData);
      showAlert('Success', 'Charger added successfully', [
        {
          text: 'OK',
          onPress: () => {
            handleCloseAlert();
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error('Error adding charger:', error.message);
      showAlert('Error', 'Failed to add charger. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Charger</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
        maxLength={255}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        maxLength={255}
      />
      <TextInput
        style={styles.input}
        placeholder="kWh Type"
        value={kWhType}
        onChangeText={setKWhType}
        maxLength={255}
      />
      <TextInput
        style={styles.input}
        placeholder="Charger Type"
        value={chargerType}
        onChangeText={setChargerType}
        maxLength={255}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddCharger}>
        <Text style={styles.addButtonText}>Add Charger</Text>
      </TouchableOpacity>
      <CustomAlert
        visible={alert.visible}
        title={alert.title}
        message={alert.message}
        onClose={handleCloseAlert}
        actions={alert.actions}
      />
    </View>
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
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddCharger;
