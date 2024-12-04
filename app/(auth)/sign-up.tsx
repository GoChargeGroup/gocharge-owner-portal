import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import CustomAlert from '@/components/CustomAlert';
import { Link, router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import { signup } from '@/lib/authService';
import { navigate } from 'expo-router/build/global-state/routing';

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'owner',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', actions: [] });
  const [securityQuestionsPage, setSecurityQuestionsPage] = useState(false);
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');

  const showAlert = (title, message, actions = []) => {
    setAlert({ visible: true, title, message, actions });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  const submit = async () => {
    setModalVisible(false);
    if (!form.username || !form.email || !form.password|| !answer1 || !answer2) {
      showAlert('Error', 'Please fill in all the fields');
      return;
    }
    if (!verifyInput()) {
      return;
    }
    setIsSubmitting(true);
    try {
      const user = await signup(form.username, form.password, form.email.toLowerCase(), form.role, [answer1, answer2]);
      setIsLoggedIn(true);
      setUser(user);
      showAlert('Success', 'Your account has been successfully created', [
        { text: 'OK', onPress: () => {
          handleCloseAlert();
          router.push('(station)/station-main');
        }},
      ]);
    } catch (error) {
      showAlert('Error', error.message || 'Failed to sign up');
    } finally {
      setIsSubmitting(false);
    }
  };

  function verifyInput() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (form.username.includes(' ')) {
      showAlert('Error', 'Username cannot contain spaces');
      return false;
    }
    if (!emailRegex.test(form.email)) {
      showAlert('Error', 'Email is invalid');
      return false;
    } else return true;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        { !securityQuestionsPage ? (
          <View style={{ width: '100%', paddingHorizontal: 16, marginVertical: 24, flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 32, textAlign: 'center', color: '#000', fontWeight: '400', marginBottom: 8 }}>
              Power Up Your Journey. Join Us Today!
            </Text>
            <FormField
              placeholder="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles={{ marginTop: 16, width: '92%' }}
              formStyles={{ borderWidth: 2, borderColor: '#808080', borderRadius: 16 }}
              keyboardType="email-address"
            />
            <FormField
              placeholder="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles={{ width: '92%' }}
              formStyles={{ borderWidth: 2, borderColor: '#808080', borderRadius: 16 }}
            />
            <FormField
              placeholder="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles={{ width: '92%', marginBottom: 16 }}
              formStyles={{ borderWidth: 2, borderColor: '#808080', borderRadius: 16 }}
              secureTextEntry={!passwordVisible}
            />
            <View style={{flexDirection: "row", marginTop: 4, marginHorizontal: 10, alignItems: 'center', justifyContent: 'center'}}>
              <CustomButton
                title="Back"
                handlePress={() => router.push('/(auth)/sign-in')}
                containerStyles={{ marginTop: 16, marginRight: 16 }}
              />
              <CustomButton
                title="Create Account"
                handlePress={() => setModalVisible(!isModalVisible)} 
                containerStyles={{ marginTop: 16 }}
                isLoading={isSubmitting}
              />
            </View>
            </View>
          ) : (
            <View className="w-full px-4 my-6 flex-1 items-center">
              <Text style={{
                fontSize: 40,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>Almost there!</Text>
              <Text style={{
                fontSize: 20,
                textAlign: 'center',
                marginBottom: 16,
              }}>Just answer a few security questions to finish signing up.</Text>
              <Text style={{
                fontSize: 15,
                marginBottom: 4,
                fontWeight: 'bold',
              }}>Security Question 1</Text>
              <Text style={{
                fontSize: 15,
                marginBottom: 12,
              }}>What street did you grow up on?</Text>
              <FormField
                placeholder="Enter your answer"
                value={answer1}
                onChangeText={setAnswer1}
                formStyles={{ borderWidth: 2, borderColor: '#808080', borderRadius: 16, marginBottom: 16 }}
              />
        
              <Text style={{
                fontSize: 15,
                marginBottom: 4,
                fontWeight: 'bold',
              }}>Security Question 2</Text>
              <Text style={{
                fontSize: 15,
                marginBottom: 12,
              }}>What was the name of your first school?</Text>
              <FormField
                placeholder="Enter your answer"
                value={answer2}
                onChangeText={setAnswer2}
                formStyles={{ borderWidth: 2, borderColor: '#808080', borderRadius: 16 }}
              />
        
              <View style={{flexDirection: "row", marginTop: 20, marginHorizontal: 10}}>
                <CustomButton title="Back" containerStyles={{width: "48%", marginRight: 8}} handlePress={() => setSecurityQuestionsPage(false)} />
                <CustomButton title="Submit" containerStyles={{width: "48%", marginLeft: 8}} handlePress={submit} />
              </View>
            </View>
          )}
          <Modal
            animationType="slide"
            transparent
            visible={isModalVisible}
            onRequestClose={() => setModalVisible(!isModalVisible)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Confirm Information</Text>
                <Text style={styles.modalText}>Email: {form.email}</Text>
                <Text style={styles.modalText}>Username: {form.username}</Text>
                <Text style={styles.modalText}>Password:</Text>
                <View style={styles.passwordContainer}>
                  <Text style={styles.passwordText}>
                    {passwordVisible ? form.password : '••••••••'}
                  </Text>
                  <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.toggleVisibility}>
                    <Text>{passwordVisible ? 'Hide' : 'Show'}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.modalActions}>
                  <CustomButton title="Back" handlePress={() => setModalVisible(false)} containerStyles={{width: "48%"}} />
                  <CustomButton title="Confirm" handlePress={() => { 
                    if(!form.username || !form.email || !form.password) {
                      showAlert('Error', 'Please fill in all the fields')
                    } else {setSecurityQuestionsPage(!securityQuestionsPage); setModalVisible(false);}}}
                    containerStyles={{width: "48%"}}
                    isLoading={isSubmitting} />
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
        <CustomAlert
          visible={alert.visible}
          title={alert.title}
          message={alert.message}
          onClose={handleCloseAlert}
          actions={alert.actions}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalText: {
    marginBottom: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordText: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  toggleVisibility: {
    marginLeft: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
};

export default SignUp;
