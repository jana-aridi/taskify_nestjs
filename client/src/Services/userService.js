import axios from "axios"; 
import LocalStorageFile from "../Utils/LocalStorageFile";

const API_URL = "http://localhost:8080/users";

/**
 * `joinWorkspace` function is used to add a user to a workspace.
 * It sends a PUT request to the /users/joinWorkspace/:userID endpoint with the workspace data.
 *
 * @param {string} userID - The ID of the user joining the workspace.
 * @param {Object} data - Data necessary for joining a workspace.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response object.
 *
 * Usage:
 * - This function should be used when adding a user to a workspace.
 * - It requires the user ID and workspace data, and returns the server's response after the operation.
 */
const joinWorkspace = async (userID, data) => { 
 
  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.put(`${API_URL}/joinWorkspace/${userID}`, data, config); 

  return response;

};
 
/**
 * `deleteUser` function is used to delete a user.
 * It sends a DELETE request to the /users/:userID endpoint.
 *
 * @param {string} userID - The ID of the user to be deleted.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response object.
 *
 * Usage:
 * - This function should be used to delete a user from the system.
 * - It requires the user ID and returns the server's response after attempting to delete the user.
 */
const deleteUser = async (userID) => {

  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.delete(`${API_URL}/${userID}`,config);
  return response;

};

/**
 * `getUserTasks` function is used to retrieve tasks assigned to a specific user.
 * It sends a GET request to the /users/getTasks/:userID endpoint.
 *
 * @param {string} userID - The ID of the user whose tasks are to be retrieved.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response object.
 *
 * Usage:
 * - This function should be used to fetch tasks assigned to a user.
 * - It requires the user ID and returns the server's response containing the user's tasks.
 */
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