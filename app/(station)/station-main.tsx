import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useNavigation, useRouter } from 'expo-router';
import { getUserChargers } from '@/lib/authService';

const StationMainPage = () => {
 
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchChargers = async () => {
      try {
        const userStations = await getUserChargers(); 
        console.log(userStations);
        setStations(userStations || []); 
      } catch (error) {
        console.error("Error fetching chargers:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchChargers();
  }, []);
  

  // Navigate to create station request page
  const handleCreateStationRequest = () => {
    router.push('(station)/create-station-request');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Stations</Text>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateStationRequest}>
        <Text style={styles.buttonText}>Create Station Request</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView style={styles.chargerList}>
            {stations.length === 0 ? (
                <Text style={styles.noChargersText}>No chargers found.</Text>
            ) : (
                stations.map((station) => (
                <View key={station._id} style={styles.chargerItem}>
                    <Text style={styles.chargerName}>{station.name}</Text>
                    <Text style={styles.chargerDetails}>{station.description}</Text>
                    <Text style={styles.chargerDetails}>{station.address}</Text>
                </View>
                ))
            )}
            </ScrollView>
      )}
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
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chargerList: {
    marginTop: 16,
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
  noChargersText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default StationMainPage;
