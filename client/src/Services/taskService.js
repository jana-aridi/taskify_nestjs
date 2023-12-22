import axios from "axios"; 
import LocalStorageFile from "../Utils/LocalStorageFile";

const API_URL = "http://localhost:8080/tasks";


const createTask = async (taskData) => {
  
  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.post(`${API_URL}/add`, taskData, config);  
  
  return response;

};


const updateTask = async (taskID, taskData) => {  

  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.put(`${API_URL}/update/${taskID}`, taskData, config); 

  return response;

};


const deleteTask = async (taskID) => {

  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.delete(`${API_URL}/delete/${taskID}`, config);
  return response;

};

export default {
  createTask, 
  updateTask,
  deleteTask
}