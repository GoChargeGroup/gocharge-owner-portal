import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const CustomAlert = ({ visible, title, message, onClose, actions = [] }) => {
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            {actions.length > 0 ? (
              actions.map((action, index) => (
                <TouchableOpacity key={index} style={styles.actionButton} onPress={action.onPress}>
                  <Text style={styles.actionText}>{action.text}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <TouchableOpacity style={styles.actionButton} onPress={onClose}>
                <Text style={styles.actionText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  actionButton: {
    padding: 10,
    marginHorizontal: 5,
  },
  actionText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});

export default CustomAlert;
