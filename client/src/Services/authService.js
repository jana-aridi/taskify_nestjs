import axios from "axios"; 

// Base API URL 
const API_URL = "http://localhost:8080";


/**
 * `loginService` function is used to authenticate a user.
 * It sends a POST request to the /login endpoint with the user's credentials.
 * 
 * @param {Object} data - The user's login data, typically containing email and password.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response object.
 *
 * Usage:
 * - This service function should be used in scenarios where user authentication is required.
 * - The function expects an object containing the user's login credentials and returns the server's response.
 */
const loginService = async (data) => {

    const response = await axios.post(`${API_URL}/login`, data);

    return response;
    
}


/**
 * `signupService` function is used to register a new user.
 * It sends a POST request to the /register endpoint with the user's registration data.
 * 
 * @param {Object} data - The user's signup data, typically containing personal and account information.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response object.
 *
 * Usage:
 * - This service function should be used when a new user is registering to the application.
 * - The function expects an object containing the user's registration details and returns the server's response.
 */
const signupService = async (data) => {
  
  const response = await axios.post(`${API_URL}/register`, data);
  
  return response;
}

export default {
    loginService,
    signupService 
}