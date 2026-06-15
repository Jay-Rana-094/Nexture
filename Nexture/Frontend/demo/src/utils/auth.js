export const isLoggedIn = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getUsername = () => {
  return localStorage.getItem('username');
};

export const logout = () => {
    alert('Confirm logout')
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
};
