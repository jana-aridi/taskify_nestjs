import axios from "axios"; 
import LocalStorageFile from "../Utils/LocalStorageFile";

const API_URL = "http://localhost:8080/workspaces";


const getWorkspaceEmployees = async (workspaceID) => { 
      
  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.get(`${API_URL}/${workspaceID}/employees`, config);
  
  return response;

};

const removeUserFromWorkspace = async (workspaceID, userID) => { 
      
  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.delete(`${API_URL}/${workspaceID}/employees/${userID}`, config);
  
  return response;

};

const getOtherWorkspaceEmployees = async (workspaceID, userID) => { 

  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.get(`${API_URL}/${workspaceID}/employees/${userID}`, config);
  return response;
  
}



export default {
    getWorkspaceEmployees, 
    removeUserFromWorkspace,
    getOtherWorkspaceEmployees
}