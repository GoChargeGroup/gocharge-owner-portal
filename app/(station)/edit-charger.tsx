import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { editCharger } from '@/lib/authService';
import CustomAlert from '@/components/CustomAlert';
import { useGlobalContext } from '@/context/GlobalProvider';

const EditCharger = () => {
  const { charger} = useLocalSearchParams();
  const chargerData = JSON.parse(charger);
  const { getCallback } = useGlobalContext(); 
  const onChargerEdited = getCallback('onChargerEdited');
  const [name, setName] = useState(chargerData.name || '');
  const [description, setDescription] = useState(chargerData.description || '');
  const [kWhType, setKWhType] = useState(chargerData.kWh_types_id || '');
  const [chargerType, setChargerType] = useState(chargerData.charger_types_id || '');
  const [price, setPrice] = useState(String(chargerData.price || ''));
  const [status, setStatus] = useState(chargerData.status || 'working');
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

  const handleEditCharger = async () => {
    const error = validateFields();
    if (error) {
      showAlert('Validation Error', error);
      return;
    }

    try {
      const updatedCharger = {
        _id: chargerData._id,
        station_id: chargerData.station_id,
        name,
        description,
        kWh_types_id: kWhType,
        charger_types_id: chargerType,
        price: parseInt(price, 10),
        status,
      };

      await editCharger(updatedCharger);
      if (onChargerEdited) {
        onChargerEdited(updatedCharger); 
      }
      showAlert('Success', 'Charger updated successfully', [
        {
          text: 'OK',
          onPress: () => {
            handleCloseAlert();
            router.back(); // Navigate back to the previous page
          },
        },
      ]);
    } catch (error) {
      console.error('Error editing charger:', error.message);
      showAlert('Error', 'Failed to edit charger. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Charger</Text>
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
      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Status:</Text>
        <Picker
          selectedValue={status}
          onValueChange={(itemValue) => setStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Working" value="working" />
          <Picker.Item label="Not Working" value="not working" />
        </Picker>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleEditCharger}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
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
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
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

export default EditCharger;
