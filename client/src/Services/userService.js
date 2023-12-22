import axios from "axios"; 
import LocalStorageFile from "../Utils/LocalStorageFile";

const API_URL = "http://localhost:8080/users";


const joinWorkspace = async (userID, data) => { 
 
  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.put(`${API_URL}/joinWorkspace/${userID}`, data, config); 

  return response;

};
 

const deleteUser = async (userID) => {

  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.delete(`${API_URL}/${userID}`,config);
  return response;

};


const getUserTasks = async (userID) => {

  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.get(`${API_URL}/getTasks/${userID}`, config);
  return response;

}; 

export default {
    joinWorkspace,
    getUserTasks,
    deleteUser
}