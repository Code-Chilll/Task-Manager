// Cookie utility functions
export const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

export const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

// Authentication helper functions
export const setUserEmail = (email) => {
  setCookie('userEmail', email, 30); // Store for 30 days
};

export const getUserEmail = () => {
  return getCookie('userEmail');
};

export const setUserRole = (role) => {
  setCookie('userRole', role, 30); // Store for 30 days
};

export const getUserRole = () => {
  return getCookie('userRole');
};

export const setUserName = (name) => {
  setCookie('userName', name, 30); // Store for 30 days
};

export const getUserName = () => {
  return getCookie('userName');
};

export const isAdmin = () => {
  return getUserRole() === 'ADMIN';
};

export const logout = () => {
  deleteCookie('userEmail');
  deleteCookie('userRole');
  deleteCookie('userName');
  window.location.href = '/login';
};

export const isAuthenticated = () => {
  return getUserEmail() !== null;
};
