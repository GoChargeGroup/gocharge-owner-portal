import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getUserChargers, editStation } from '@/lib/authService';
import CustomAlert from '@/components/CustomAlert';
import { useGlobalContext } from '@/context/GlobalProvider';

const StationMainPage = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', actions: [] });
  const router = useRouter();
  const { setCallback } = useGlobalContext();

  useEffect(() => {
    const fetchChargers = async () => {
      try {
        const userStations = await getUserChargers();
        setStations(userStations || []);
      } catch (error) {
        console.error('Error fetching chargers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChargers();
  }, []);

  useEffect(() => {
    setCallback('onStationEdited', (updatedStation) => {
      setStations((prevStations) =>
        prevStations.map((station) =>
          station._id === updatedStation._id ? updatedStation : station
        )
      );
    });
  }, []);

  const handleCloseAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  const showAlert = (title, message, actions = []) => {
    setAlert({ visible: true, title, message, actions });
  };

  const handleToggleDisable = async (station) => {
    showAlert(
      'Confirm Action',
      `Are you sure you want to ${
        station.is_disabled ? 'enable' : 'disable'
      } this station?`,
      [
        {
          text: 'Cancel',
          onPress: handleCloseAlert,
        },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              const updatedStation = {
                ...station,
                is_disabled: !station.is_disabled,
              };

              const result = await editStation(updatedStation);
              setStations((prevStations) =>
                prevStations.map((s) =>
                  s._id === result._id ? result : s
                )
              );
              handleCloseAlert();
            } catch (error) {
              console.error('Error toggling station status:', error);
              showAlert('Error', 'Failed to toggle station status. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleEditStation = (station) => {
    router.push({
      pathname: '(station)/edit-station',
      params: { station: JSON.stringify(station) },
    });
  };

  const handleStationClick = (station) => {
    router.push({
      pathname: '(station)/station-details',
      params: { station: JSON.stringify(station) },
    });
  };

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
            <Text style={styles.noChargersText}>No stations found.</Text>
          ) : (
            stations.map((station) => (
              <View key={station._id} style={styles.stationItem}>
                <TouchableOpacity
                  style={[
                    styles.chargerItem,
                    station.is_disabled && styles.disabledStation,
                  ]}
                  onPress={() => handleStationClick(station)}
                >
                  <Text style={styles.chargerName}>{station.name}</Text>
                  <Text style={styles.chargerDetails}>{station.description}</Text>
                  <Text style={styles.chargerDetails}>{station.address}</Text>
                  {station.is_disabled && <Text style={styles.disabledText}>Disabled</Text>}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEditStation(station)}
                >
                  <Text style={styles.editButtonText}>Edit Station</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.disableButton}
                  onPress={() => handleToggleDisable(station)}
                >
                  <Text style={styles.disableButtonText}>
                    {station.is_disabled ? 'Enable Station' : 'Disable Station'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      )}

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
  stationItem: {
    marginBottom: 16,
  },
  chargerItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  disabledStation: {
    backgroundColor: '#f8d7da',
  },
  chargerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chargerDetails: {
    fontSize: 14,
    color: '#555',
  },
  disabledText: {
    fontSize: 14,
    color: '#ff0000',
    fontWeight: 'bold',
  },
  editButton: {
    backgroundColor: '#007EFF',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disableButton: {
    backgroundColor: '#FF6347',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  disableButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  noChargersText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default StationMainPage;
