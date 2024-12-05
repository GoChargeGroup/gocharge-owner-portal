const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;

import AsyncStorage from '@react-native-async-storage/async-storage';
export const login = async (username, password) => {
  try {
    const queryParams = new URLSearchParams({
      username,
      password,
    }).toString();

    const response = await fetch(`${BASE_URL}/login?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Incorrect username or password');
    }

    const user = await response.json();
    
    const token = response.headers.get('Authorization');
    if (token) {
      await AsyncStorage.setItem('authToken', token);
    } else {
      throw new Error('Token not found in response');
    }

    console.log(user);
    console.log(token);

    return user; 
  } catch (error) {
    throw error; 
  }
};

export const signup = async (username, password, email, role, answers) => {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        email,
        role: role || 'user',
        security_question_answers: answers
      }),
    });
  
    const user = await response.json();

    if (!response.ok) {
      throw new Error(user || 'Something went wrong during signup');
    }
    const token = response.headers.get('Authorization');
    if (token) {
      await AsyncStorage.setItem('authToken', token);
    } else {
      throw new Error('Token not found in response');
    }
    console.log(user);
    return user; 
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const sendEditUsernameVerification = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${BASE_URL}/owner/edit-username-request`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `${token}`,
      },
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error('Failed to send email verification. Please try again.');
    }
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const editUsername = async (otp, newUsername) => {
  const token = await AsyncStorage.getItem('authToken');
  
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(`${BASE_URL}/owner/edit-username`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      otp: otp,
      new_username: newUsername,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.message || 'Failed to edit the account username');
  }
};

export const editEmail = async (newEmail, answers) => {
  const token = await AsyncStorage.getItem('authToken');
  
  if (!token) throw new Error('No authentication token found');

  const response = await fetch(`${BASE_URL}/owner/edit-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `${token}`,
    },
    body: JSON.stringify({
      email: newEmail,
      security_question_answers: answers
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.log(errorData);
    throw new Error(errorData.message || 'Failed to edit the account username');
  }
};

  export const logout = async () => {
    try {
      await AsyncStorage.removeItem('authToken'); 
      const response = await fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  export const addStationRequest = async (stationData) => {

    try {
      const token = await AsyncStorage.getItem('authToken');

      const response = await fetch(`${BASE_URL}/owner/request-station`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `${token}`,
        },
        body: JSON.stringify(stationData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add station');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in addStationRequest:', error.message);
      throw error;
    }
  };

  export const getUserChargers = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');
  
      const response = await fetch(`${BASE_URL}/owner/get-user-chargers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch chargers');
      }
  
      const chargers = await response.json();
      return chargers;
    } catch (error) {
      console.error('Error in getUserChargers:', error.message);
      throw error;
    }
  };

  export const getStationAndChargers = async (stationID) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');
  
      const response = await fetch(`${BASE_URL}/owner/station-and-chargers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify({ station_id: stationID }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch station and chargers');
      }
  
      const stationAndChargers = await response.json();

      return stationAndChargers;
    } catch (error) {
      console.error('Error in getStationAndChargers:', error.message);
      throw error;
    }
  };
  
  
  export const addCharger = async (chargerData) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');
  
      const response = await fetch(`${BASE_URL}/owner/add-charger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(chargerData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add charger');
      }
  
      return await response.json();
    } catch (error) {
      console.error('Error in addCharger:', error.message);
      throw error;
    }
  };

  export const editCharger = async (chargerData) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');
      console.log(chargerData);
      const response = await fetch(`${BASE_URL}/owner/edit-charger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(chargerData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to edit charger');
      }
  
      const updatedCharger = await response.json();
      return updatedCharger;
    } catch (error) {
      console.error('Error in editCharger:', error.message);
      throw error;
    }
  };
  export const editStation = async (stationData) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');
  
      const response = await fetch(`${BASE_URL}/owner/edit-station`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: JSON.stringify(stationData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to edit station');
      }
  
      const updatedStation = await response.json();
      return updatedStation;
    } catch (error) {
      console.error('Error in editStation:', error.message);
      throw error;
    }
  };
  

  