export const AuthValidator = {
  validateCredentials: (username: string, password: string): boolean => {
    return username.trim() === '123' && password.trim() === '123';
  },

  setAuthToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('researchmind_token', token);
      localStorage.setItem('researchmind_user', JSON.stringify({ name: 'Scholar', username: '123' }));
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('researchmind_token');
    }
    return false;
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('researchmind_token');
      localStorage.removeItem('researchmind_user');
    }
  }
};
