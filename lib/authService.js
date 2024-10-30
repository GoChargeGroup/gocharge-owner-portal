const BASE_URL = 'http://10.1.22.21:8083'; //use your IP address here
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

export const signup = async (username, password, email, role) => {
    try {
      const queryParams = new URLSearchParams({
        username,
        password,
        email,
        role: role || 'owner',
      }).toString();
  
      const response = await fetch(`${BASE_URL}/signup?${queryParams}`, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
        },
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
  
  