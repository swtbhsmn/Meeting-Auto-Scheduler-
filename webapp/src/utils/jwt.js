import { jwtDecode } from "jwt-decode";
export const isTokenValid = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
          return { isValid: false, message: 'Token has expired' };
        }
        return { isValid: true, payload: decoded };
      } catch (error) {
        return { isValid: false, message: 'Invalid token' };
      }
};
