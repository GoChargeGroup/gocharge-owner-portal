import { View, Text, TouchableOpacity, Image, Switch, ScrollView, Alert, Modal, TextInput } from 'react-native-web';
import React, { useEffect, useState } from 'react';
import { useGlobalContext } from '@/context/GlobalProvider';

import { icons } from '@/constants';
import { AntDesign } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
// import { deleteUser, logout, sendDeleteVerification } from '@/lib/authService';
import { useRouter } from 'expo-router';
import { logout } from '@/lib/authService';
import { OtpInput } from 'react-native-otp-entry';
import { deleteUser, sendDeleteVerification } from '@/lib/authService';
import CustomAlert from '@/components/CustomAlert';

const Profile = () => {
  const { user, setUser, setIsLoggedIn, isLoading } = useGlobalContext();
  const [carChargingNotifications, setCarChargingNotifications] = useState(true);
  const [promotionsNotifications, setPromotionsNotifications] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [otp, setOTP] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', actions: [] });
  const router = useRouter();

  useEffect(() => {
    if (!user && !isLoading) {
      router.replace('/sign-in');
    }
  }, [user, isLoading]);

  const showAlert = (title, message, actions = []) => {
    setAlert({ visible: true, title, message, actions });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  const showDeleteModal = async () => {
    try {
      await sendDeleteVerification();
    } catch (error) {
      showAlert('Error', `${error}`);
    }
    setModalVisible(true);
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUser(otp);
      setUser(null);
      setIsLoggedIn(false);
      showAlert('Success', 'Account successfully deleted.', [
        { text: 'OK', onPress: () => {
          handleCloseAlert();
          router.push('/sign-in');
        }},
      ]);
    } catch (error) {
      console.log(error);
      setModalVisible(false);
      showAlert('Error', `${error}`);
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
      showAlert('Error', "Failed to logout. Please try again.");
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

  useEffect(() => {
    let timer;
    if (modalVisible) {
      setTimeLeft(300); 

      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer);
            setModalVisible(false); 
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer); 
  }, [modalVisible]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

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
            <Text style={{ fontSize: 16, textAlign: 'center'}}>Check your email for a verification code.</Text>
            <Text style={{ fontSize: 16, marginBottom: 16, color: 'red' }}>
              Code will expire in: {formatTime(timeLeft)}
            </Text>
            <OtpInput
              numberOfDigits={5}
              onTextChange={(otp) => { setOTP(otp) }}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 16}}>
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

export default Profile;
function showAlert(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}

