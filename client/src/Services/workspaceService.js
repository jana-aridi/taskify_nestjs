import axios from "axios"; 
import LocalStorageFile from "../Utils/LocalStorageFile";

const API_URL = "http://localhost:8080/workspaces";

/**
 * `getWorkspaceEmployees` function retrieves all employees of a specific workspace.
 * It sends a GET request to the /workspaces/:workspaceID/employees endpoint.
 *
 * @param {string} workspaceID - The ID of the workspace.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response object.
 *
 * Usage:
 * - This function should be used to fetch a list of all employees in a given workspace.
 * - It requires the workspace ID and returns the server's response containing the list of employees.
 */
const getWorkspaceEmployees = async (workspaceID) => { 
      
  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.get(`${API_URL}/${workspaceID}/employees`, config);
  
  return response;

};

/**
 * `removeUserFromWorkspace` function is used to remove a user from a workspace.
 * It sends a DELETE request to the /workspaces/:workspaceID/employees/:userID endpoint.
 *
 * @param {string} workspaceID - The ID of the workspace.
 * @param {string} userID - The ID of the user to be removed from the workspace.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response object.
 *
 * Usage:
 * - This function should be used to remove an employee from a workspace.
 * - It requires both the workspace ID and the user ID, and returns the server's response after the operation.
 */
const removeUserFromWorkspace = async (workspaceID, userID) => { 
      
  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.delete(`${API_URL}/${workspaceID}/employees/${userID}`, config);
  
  return response;

};

/**
 * `getOtherWorkspaceEmployees` function retrieves all employees of a workspace excluding a specific user.
 * It sends a GET request to the /workspaces/:workspaceID/employees/:userID endpoint.
 *
 * @param {string} workspaceID - The ID of the workspace.
 * @param {string} userID - The ID of the user to be excluded from the list.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response object.
 *
 * Usage:
 * - This function should be used to fetch a list of employees in a workspace, excluding a specific user.
 * - It requires the workspace ID and the user ID to exclude, and returns the server's response with the list of employees.
 */
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