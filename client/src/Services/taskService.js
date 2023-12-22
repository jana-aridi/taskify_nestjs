import axios from "axios"; 
import LocalStorageFile from "../Utils/LocalStorageFile";

const API_URL = "http://localhost:8080/tasks";


/**
 * `createTask` function is used to create a new task.
 * It sends a POST request to the /tasks/add endpoint with the task data.
 *
 * @param {Object} taskData - Data for the new task.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response object.
 *
 * Usage:
 * - This function should be used when creating a new task in the application.
 * - It requires the task data and returns the server's response after attempting to create the task.
 */
const createTask = async (taskData) => {
  
  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.post(`${API_URL}/add`, taskData, config);  
  
  return response;

};


/**
 * `updateTask` function is used to update an existing task.
 * It sends a PUT request to the /tasks/update/:taskID endpoint with the updated task data.
 *
 * @param {string} taskID - The ID of the task to be updated.
 * @param {Object} taskData - Updated data for the task.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response object.
 *
 * Usage:
 * - This function should be used when updating an existing task.
 * - It requires the task ID and the new task data and returns the server's response after attempting to update the task.
 */
const updateTask = async (taskID, taskData) => {  

  const config = {
    headers: {
      'Authorization': `Bearer ${LocalStorageFile.getToken()}`
    }
  };

  const response = await axios.put(`${API_URL}/update/${taskID}`, taskData, config); 

  return response;

};

/**
 * `deleteTask` function is used to delete an existing task.
 * It sends a DELETE request to the /tasks/delete/:taskID endpoint.
 *
 * @param {string} taskID - The ID of the task to be deleted.
 * @returns {Promise<AxiosResponse>} - A promise that resolves to the Axios response object.
 *
 * Usage:
 * - This function should be used when needing to delete a task.
 * - It requires the task ID and returns the server's response after attempting to delete the task.
 */
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