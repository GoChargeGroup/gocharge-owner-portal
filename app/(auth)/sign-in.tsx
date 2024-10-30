import { View, Text, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Link, router } from 'expo-router';
import FormField from '@/components/FormField';
import CustomButton from '@/components/CustomButton';
import { useGlobalContext } from '@/context/GlobalProvider';
import { login } from '@/lib/authService';

const SignIn = () => {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
 

  const submit = async () => {
    if (!form.username || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields');
      return;
    }
    setIsSubmitting(true);
    try {
      const user = await login(form.username, form.password);
      
      Alert.alert('Success', 'Login successful!');
      router.push('/');
    } catch (error) {
      Alert.alert(
        'Error',
        error.message || 'Failed to login',
        [
          { text: 'Try Again', style: 'cancel' },
          {
            text: 'Reset Password',
            onPress: () => {
              router.push('/reset-password');
            },
          },
        ],
        { cancelable: true }
      );
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
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default SignIn;
