import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { icons } from '@/constants';

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading, picture }) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        {
          width: '92%',
          padding: 16,
          marginBottom: 12,
          backgroundColor: '#E0F2FF',
          borderRadius: 16,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: isLoading ? 0.5 : 1,
        },
        containerStyles,
      ]}
      disabled={isLoading}
    >
      {picture && <Image source={picture} style={{ width: 16, height: 20, marginRight: 8 }} />}
      <Text style={[{ fontSize: 18, color: '#4CAF50', fontWeight: 'bold' }, textStyles]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
