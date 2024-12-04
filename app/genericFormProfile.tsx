import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { OtpInput } from "react-native-otp-entry";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { router } from 'expo-router';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';
import { useGlobalContext } from '@/context/GlobalProvider';
import { editEmail, editUsername, sendEditUsernameVerification } from '@/lib/authService';

const genericFormProfile = () => {
  const navigation = useNavigation();
  const { setUser, user } = useGlobalContext();
  const route = useRoute();
  const { fieldName, fieldValue, userId, displayName } = route.params;
  const [value, setValue] = useState(fieldValue);
  const [usernameModalVisible, setUsernameModalVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [otp, setOTP] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');

  const showEditUsernameModal = async () => {
    try {
      await sendEditUsernameVerification();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
    setUsernameModalVisible(true);
  };

  const handleUpdateUsername = async () => {
    try {
      verifyInput();
      await editUsername(otp, value);
      Alert.alert('Success', 'Username updated successfully!');
      router.replace('/profile');
    } catch (error) {
      console.log(error);
      setUsernameModalVisible(false);
      Alert.alert('Error', 'Failed to update username. Please try again later.');
      router.replace('/profile');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      if (!verifyInput()) return;
      await editEmail(value, [answer1, answer2]);
      Alert.alert('Success', 'Email updated successfully!');
      router.replace('/profile');
    } catch (error) {
      console.log(error);
      setEmailModalVisible(false);
      Alert.alert('Error', 'Failed to update email. Please try again later.');
      router.replace('/profile');
    }
  };

  function verifyInput() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    switch (fieldName) {
      case ("username"):
        if (value.includes(' ')) {
          Alert.alert("Error", "Username cannot contain spaces");
          return false;
        } else return true;
      case ("email"):
        if (!emailRegex.test(value)) {
          Alert.alert("Error", "Email is invalid");
          return false;
        } else return true;
      default:
        return true;
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 , marginTop: 50}}>
      <SafeAreaView style={{ backgroundColor: '#F5F5F5', flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24, paddingHorizontal: 16, paddingVertical: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 56 }}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginLeft: 8 }}>Enter New {displayName}</Text>
        </View>
        <ScrollView>
          <View style={{ width: '100%', minHeight: '80vh', paddingHorizontal: 16, marginVertical: 24 }}>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                padding: 10,
                borderRadius: 8,
                marginBottom: 16,
              }}
              placeholder={`Enter ${fieldName}`}
              value={value}
              onChangeText={setValue}
            />
            <CustomButton
              title="Save"
              handlePress={() => { if (fieldName == "username") showEditUsernameModal(); else setEmailModalVisible(true); }}
              containerStyles={{width: "100%", marginTop: 16}}
            />
          </View>

          <Modal
            visible={usernameModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setUsernameModalVisible(false)}
          >
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={{
                width: 300,
                padding: 20,
                backgroundColor: 'white',
                borderRadius: 10,
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                  Edit Username
                </Text>
                <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 10 }}>
                  Please check your email for a verification code.
                </Text>
                <OtpInput
                  numberOfDigits={5}
                  onTextChange={(otp) => { setOTP(otp) }}
                />
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginRight: 10,
                      marginTop: 10,
                      backgroundColor: '#ccc',
                      padding: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={() => setUsernameModalVisible(false)}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      marginTop: 10,
                      backgroundColor: 'red',
                      padding: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={handleUpdateUsername}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            visible={emailModalVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setEmailModalVisible(false)}
          >
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={{
                width: 300,
                padding: 20,
                backgroundColor: 'white',
                borderRadius: 10,
                alignItems: 'center',
              }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
                  Edit Email
                </Text>
                <Text style={{ fontSize: 16, textAlign: 'center', marginBottom: 20 }}>
                  Please answer these security questions to finish editing your email.
                </Text>
                <Text style={{ marginBottom: 8 }}>Security Question 1</Text>
                <Text style={{ marginBottom: 12}}>What street did you grow up on?</Text>
                <FormField
                  placeholder="Enter your answer"
                  value={answer1}
                  onChangeText={setAnswer1}
                  formStyles={{
                    borderWidth: 2,
                    borderColor: '#4B5563',
                    borderRadius: 16,
                    marginBottom: 8,
                    width: '100%'
                  }}
                  textStyles={{ paddingTop: 0 }}
                  otherStyles={{ marginBottom: 0, width: '100%' }}
                />

                <Text style={{ marginTop: 16, marginBottom: 8 }}>Security Question 2</Text>
                <Text style={{ marginBottom: 12}}>What was the name of your first school?</Text>
                <FormField
                  placeholder="Enter your answer"
                  value={answer2}
                  onChangeText={setAnswer2}
                  formStyles={{
                    borderWidth: 2,
                    borderColor: '#4B5563',
                    borderRadius: 16,
                    marginBottom: 8,
                    width: '100%'
                  }}
                  textStyles={{ paddingTop: 0 }}
                  otherStyles={{ marginBottom: 0, width: '100%' }}
                />

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginRight: 10,
                      marginTop: 15,
                      backgroundColor: '#ccc',
                      padding: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={() => {setEmailModalVisible(false); setAnswer1(''); setAnswer2('');}}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      marginLeft: 10,
                      marginTop: 15,
                      backgroundColor: 'red',
                      padding: 10,
                      borderRadius: 5,
                      alignItems: 'center',
                    }}
                    onPress={handleUpdateEmail}
                  >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default genericFormProfile;
