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