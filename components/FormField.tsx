import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useState } from 'react';
import { icons } from '@/constants';

const FormField = ({ title, value, placeholder, handleChangeText, otherStyles, textStyles, formStyles, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[{ marginBottom: 8 }, otherStyles]}>
      {title && <Text style={{ fontSize: 16, color: '#7b7b8b', fontWeight: '500' }}>{title}</Text>}
      <View
        style={[
          {
            width: '100%',
            height: 64,
            paddingHorizontal: 16,
            backgroundColor: '#FFF',
            borderColor: '#808080',
            borderWidth: 1,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
          },
          formStyles,
        ]}
      >
        <TextInput
          style={[
            {
              flex: 1,
              fontSize: 16,
              color: '#000',
            },
            textStyles,
          ]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          multiline={title !== 'Password'} // Enable multiline for non-password fields
          textAlignVertical="top" // Ensure text starts at the top
          blurOnSubmit={true} // Dismiss keyboard on return key
          onSubmitEditing={props.onSubmitEditing} // Handle return key
          {...props}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
