import axios from "axios"; 

const API_URL = "http://localhost:8080";

const loginService = async (data) => {

    const response = await axios.post(`${API_URL}/login`, data);

    return response;
    
}

const signupService = async (data) => {
  
  const response = await axios.post(`${API_URL}/register`, data);
  
  return response;
}

export default {
    loginService,
    signupService 
}