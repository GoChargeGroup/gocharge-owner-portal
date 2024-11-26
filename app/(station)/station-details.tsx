import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getStationAndChargers } from '@/lib/authService';
import { useGlobalContext } from '@/context/GlobalProvider';

const StationDetails = () => {
  const { station } = useLocalSearchParams();
  const stationData = JSON.parse(station);
  const [stationDetails, setStationDetails] = useState(null);
  const [chargers, setChargers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCallback } = useGlobalContext();
  const fetchStationData = async () => {
    try {
      const data = await getStationAndChargers(stationData._id);
      setStationDetails(data.station);
      setChargers(data.chargers || []);
    } catch (error) {
      console.error('Error fetching station and chargers:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStationData();
  }, [stationData._id]);

  const handleAddCharger = () => {
    setCallback('onChargerAdded', (newCharger) => {
      setChargers((prev) => [...prev, newCharger]); 
    });
  
    router.push({
      pathname: '(station)/add-charger',
      params: {
        station_id: stationData._id,
      },
    });
  };
  

  const handleEditCharger = (charger) => {
    setCallback('onChargerEdited', (updatedCharger) => {
      setChargers((prev) =>
        prev.map((item) => (item._id === updatedCharger._id ? updatedCharger : item))
      );
    });
  
    router.push({
      pathname: '(station)/edit-charger',
      params: {
        charger: JSON.stringify(charger),
      },
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      {stationDetails ? (
        <>
          <Text style={styles.title}>{stationDetails.name}</Text>
          <Text style={styles.subtitle}>Description:</Text>
          <Text style={styles.text}>{stationDetails.description || 'No description provided'}</Text>

          <Text style={styles.subtitle}>Address:</Text>
          <Text style={styles.text}>{stationDetails.address}</Text>

          <TouchableOpacity style={styles.addButton} onPress={handleAddCharger}>
            <Text style={styles.addButtonText}>Add Charger</Text>
          </TouchableOpacity>

          <Text style={styles.subtitle}>Chargers:</Text>
          {chargers.length > 0 ? (
            chargers.map((charger) => (
              <View key={charger._id} style={styles.chargerItem}>
                <Text style={styles.chargerName}>{charger.name}</Text>
                <Text style={styles.chargerDetails}>Description: {charger.description}</Text>
                <Text style={styles.chargerDetails}>kWh Type: {charger.kWh_types_id}</Text>
                <Text style={styles.chargerDetails}>Charger Type: {charger.charger_types_id}</Text>
                <Text style={styles.chargerDetails}>Status: {charger.status}</Text>
                <Text style={styles.chargerDetails}>Price: ${charger.price}</Text>
                <Text style={styles.chargerDetails}>Total Payments: ${charger.total_payments}</Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditCharger(charger)}
                >
                  <Text style={styles.editButtonText}>Edit Charger</Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <Text style={styles.noChargers}>No chargers available for this station.</Text>
          )}
        </>
      ) : (
        <Text style={styles.noData}>No station data found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  chargerItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  chargerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chargerDetails: {
    fontSize: 14,
    color: '#555',
  },
  noChargers: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  noData: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#007EFF',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default StationDetails;
