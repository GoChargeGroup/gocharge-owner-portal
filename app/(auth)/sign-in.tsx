import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Link, router } from 'expo-router';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import CustomAlert from '@/components/CustomAlert';
import { useGlobalContext } from '@/context/GlobalProvider';
import { login } from '@/lib/authService';

const SignIn = () => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '', actions: [] });
  const { setIsLoggedIn, setUser } = useGlobalContext();

  const showAlert = (title, message, actions = []) => {
    setAlert({ visible: true, title, message, actions });
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  const submit = async () => {
    if (!form.username || !form.password) {
      showAlert('Error', 'Please fill in all the fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const user = await login(form.username, form.password);
      setIsLoggedIn(true);
      setUser(user);
      showAlert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => {
            handleCloseAlert();  
            router.push('(station)/main');  
          },
        },
      ]);
    } catch (error) {
      showAlert('Error', error.message || 'Failed to login', [
        { text: 'Try Again', style: 'cancel', onPress: handleCloseAlert },
        {
          text: 'Reset Password',
          onPress: () => {
            handleCloseAlert();
            router.push('/reset-password');
          },
        },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '100%', paddingHorizontal: 16, marginVertical: 24, flex: 1, alignItems: 'center' }}>
            <Text style={{ fontSize: 32, textAlign: 'center', color: '#000', fontWeight: '400', marginBottom: 8 }}>
              Power Up Your Journey. Join Us Today!
            </Text>
            <FormField
              title="Username"
              placeholder="Username"
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles={{ marginTop: 16, width: '92%' }}
              formStyles={{ borderWidth: 2, borderColor: '#808080', borderRadius: 16 }}
              keyboardType="email-address"
            />
            <FormField
              title="Password"
              placeholder="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles={{ width: '92%', marginBottom: 8 }}
              formStyles={{ borderWidth: 2, borderColor: '#808080', borderRadius: 16 }}
              secureTextEntry
            />
            <CustomButton
              title="Login"
              handlePress={submit}
              containerStyles={{ marginTop: 16 }}
              isLoading={isSubmitting}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
              <Link href="/reset-password" style={{ fontSize: 16, color: '#808080', textAlign: 'center' }}>
                Forgot password?
              </Link>
              <Link href="/sign-up" style={{ fontSize: 16, color: '#1E90FF', textDecorationLine: 'underline' }}>
                / Create Station Owner Account
              </Link>
            </View>
          </View>
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

export default SignIn;
