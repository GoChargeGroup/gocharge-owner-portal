import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [callbacks, setCallbacks] = useState({});


  const setCallback = (key, callback) => {
    setCallbacks((prev) => ({ ...prev, [key]: callback }));
  };
  const getCallback = (key) => callbacks[key];
  const fetchUser = async () => {
    try {
      // Retrieve user data from AsyncStorage on app start
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setIsLoggedIn(true);
        setUser(JSON.parse(storedUser));
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Update AsyncStorage whenever `user` or `isLoggedIn` changes
  useEffect(() => {
    if (isLoggedIn && user) {
      AsyncStorage.setItem('user', JSON.stringify(user));
    } else {
      AsyncStorage.removeItem('user'); // Clear storage on logout
    }
  }, [isLoggedIn, user]);

  const logout = async () => {
    setIsLoggedIn(false);
    setUser(null);
    await AsyncStorage.removeItem('user'); // Clear persistent storage on logout
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        fetchUser,
        logout,
        setCallback,
        getCallback, // Provide logout functionality to clear state and storage
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
