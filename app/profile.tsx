import { View, Text, TouchableOpacity, Image, Switch, ScrollView, Alert, Modal, TextInput } from 'react-native-web';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';

import { icons } from '@/constants';
import { AntDesign } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
// import { deleteUser, logout, sendDeleteVerification } from '@/lib/authService';
import { useRouter } from 'expo-router';
import { logout } from '@/lib/authService';

const Profile = () => {
  const { user, setUser, setIsLoggedIn, isLoading } = useGlobalContext();
  const [carChargingNotifications, setCarChargingNotifications] = useState(true);
  const [promotionsNotifications, setPromotionsNotifications] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOTP] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.replace('/sign-in');
    }
  }, [user, isLoading]);

  const showDeleteModal = async () => {
    try {
    //   await sendDeleteVerification();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    setModalVisible(true);
  };

  const handleDeleteAccount = async () => {
    try {
    //   await deleteUser(otp);
      setUser(null);
      setIsLoggedIn(false);
      router.replace('/sign-in');
      Alert.alert('Success', 'Account deleted successfully');
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Failed to delete account. Please try again later.');
    }
  };

  const onLogoutPress = async () => {
    try {
      await logout();
      setUser(null);
      setIsLoggedIn(false);
      router.replace('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const navigateToForm = (fieldName, fieldValue, displayName) => {
    router.push({
      pathname: '/genericFormProfile',
      params: { fieldName, fieldValue, userId: user.$id, displayName },
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 24 }}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Profile</Text>
      </View>

      <View style={{ alignItems: 'center', marginTop: 16 }}>
        <TouchableOpacity onPress={() => {}} style={{ position: 'relative' }}>
          <Image
            source={{ uri: user.avatar }}
            style={{ width: 96, height: 96, borderRadius: 48 }}
          />
          <View style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4CAF50', padding: 4, borderRadius: 12 }}>
            <AntDesign name="edit" size={14} color="white" />
          </View>
        </TouchableOpacity>
      </View>

      <View style={{ marginVertical: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Details</Text>
        <TouchableOpacity
          onPress={() => navigateToForm('username', user.username || '', "Username")}
          style={{ backgroundColor: '#F0F0F0', padding: 16, borderRadius: 8, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 16 }}>{user.username || 'Username'}</Text>
          <AntDesign name="right" size={20} color="gray" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigateToForm('email', user.email || '', "Email")}
          style={{ backgroundColor: '#F0F0F0', padding: 16, borderRadius: 8, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Text style={{ fontSize: 16 }}>{user.email || 'Email'}</Text>
          <AntDesign name="right" size={20} color="gray" />
        </TouchableOpacity>
      </View>

      <View style={{ marginVertical: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Notifications</Text>
        <View style={{ backgroundColor: '#F0F0F0', padding: 16, borderRadius: 8, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Car Chargers</Text>
          <Switch value={carChargingNotifications} onValueChange={setCarChargingNotifications} />
        </View>
        <View style={{ backgroundColor: '#F0F0F0', padding: 16, borderRadius: 8, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text>Offers and Deals</Text>
          <Switch value={promotionsNotifications} onValueChange={setPromotionsNotifications} />
        </View>
        <CustomButton title="Become Partner" handlePress={() => router.push('become-partner')} picture={icons.light} />
        <TouchableOpacity onPress={onLogoutPress} style={{ backgroundColor: '#F0F0F0', padding: 16, borderRadius: 8, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Logout</Text>
          <AntDesign name="right" size={20} color="red" />
        </TouchableOpacity>
        <TouchableOpacity onPress={showDeleteModal} style={{ backgroundColor: '#F0F0F0', padding: 16, borderRadius: 8, marginTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold' }}>Delete Account</Text>
          <AntDesign name="right" size={20} color="red" />
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Delete Account</Text>
            <Text style={{ color: 'red', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 }}>This action cannot be undone.</Text>
            <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 16 }}>Check your email for a verification code.</Text>
            <TextInput style={{ width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 10, textAlign: 'center' }} placeholder="Enter verification code" placeholderTextColor="#888" keyboardType="numeric" value={otp} onChangeText={setOTP} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ flex: 1, marginRight: 10, backgroundColor: '#ccc', padding: 10, borderRadius: 5, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteAccount} style={{ flex: 1, marginLeft: 10, backgroundColor: 'red', padding: 10, borderRadius: 5, alignItems: 'center' }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Profile;
