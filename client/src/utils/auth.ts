// use this to decode a token and get the user's information out of it
import { jwtDecode } from 'jwt-decode';

interface UserToken {
  name: string;
  exp: number;
}

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    return jwtDecode(this.getToken() || '');
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      if (decoded.exp < Date.now() / 1000) {
        localStorage.removeItem('id_token'); // Remove expired token
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem('id_token'); // Retrieves the user token from localStorage
  }

  login(idToken: string) {
    localStorage.setItem('id_token', idToken); // Save the token to localStorage
    window.location.assign('/'); // Redirect the user
  }

  logout() {
    localStorage.removeItem('id_token'); // Clear user token and profile data from localStorage
    window.location.assign('/'); // this will reload the page and reset the state of the application
  }
}

export default new AuthService();
