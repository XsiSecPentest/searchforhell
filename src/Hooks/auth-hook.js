import { useState, useCallback, useEffect } from 'react';

let logoutTimer;

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [zoneId, setZoneId] = useState(null);
  const [name, setName] = useState(null);
  const [battleTag, setBattleTag] = useState(null);

  const login = useCallback((userData) => {
    console.log('Login function called with:', userData);
    const { userId, token, email, userStatus, userProfile, zoneId, name,battleTag, expiration } = userData;
    const tokenExpiration = new Date(expiration);
    if (isNaN(tokenExpiration.getTime())) {
      console.error('Invalid expiration date:', expiration);
      return; // Skip the login process if expiration date is invalid
    }
    setToken(token);
    setUserId(userId);
    setEmail(email);
    setUserStatus(userStatus);
    setUserProfile(userProfile);
    setName(name); // Ensure name is set
    setZoneId(zoneId);
    setBattleTag(battleTag);
    setTokenExpirationDate(tokenExpiration);
    console.log('Setting localStorage with:', {
      userId,
      token,
      email,
      userStatus,
      userProfile,
      name,
      zoneId,
      battleTag,
      expiration: tokenExpiration.toISOString()
    });
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId,
        token,
        email,
        userStatus,
        userProfile,
        name,
        zoneId,
        battleTag,
        expiration: tokenExpiration.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    setEmail(null);
    setName(null);
    setUserStatus(null);
    setUserProfile(null);
    setZoneId(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    console.log('Stored data retrieved:', storedData);
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData);
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return { token, login, logout, userId, email, userStatus, userProfile, name, zoneId,battleTag };
};
