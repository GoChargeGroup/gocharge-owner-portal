import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native-web';
import React from 'react';
import { icons } from '@/constants';
import { useRouter } from 'expo-router';

const Main = () => {
  const router = useRouter();

  return (
    <ScrollView style={{ padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Owner Dashboard</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => router.push('/profile')} style={cardStyle}>
          <Image source={icons.profile} style={iconStyle} />
          <Text style={textStyle}>Manage Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('(station)/station-main')} style={cardStyle}>
          <Image source={icons.stancia} style={iconStyle} />
          <Text style={textStyle}>Manage Stations</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/reviews')} style={cardStyle}>
          <Image source={icons.star} style={iconStyle} />
          <Text style={textStyle}>View Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/reports')} style={cardStyle}>
          <Image source={icons.map} style={iconStyle} />
          <Text style={textStyle}>Generate Reports</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const cardStyle = {
  backgroundColor: '#F0F0F0',
  padding: 16,
  margin: 8,
  borderRadius: 8,
  alignItems: 'center',
  width: '48%',
};

const iconStyle = {
  width: 64,
  height: 64,
  marginBottom: 8,
};

const textStyle = {
  fontSize: 16,
  fontWeight: 'bold',
};

export default Main;
