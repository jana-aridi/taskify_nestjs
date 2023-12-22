import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Workspace } from 'src/workspace/schemas/workspace.schema';
import { Task } from './schemas/task.schema';

@Injectable()
export class TaskService {
    constructor( 

        @InjectModel(Workspace.name)
        private workspaceModel: mongoose.Model<Workspace>,

        @InjectModel(Task.name)
        private taskModel: mongoose.Model<Task>

    ) {}

    /**
     * Creates a new task with the given task data.
     * Validates the presence of task data and the existence of the specified workspace.
     * @param taskData The data for the new task.
     * @returns A promise that resolves with the task creation result.
     */
    async createTask(taskData): Promise<any> {

        try { 

            if (!taskData || Object.keys(taskData).length === 0 ) {
                return {status: 400, message: "Task Data is missing!"}
            }
         
            const workspace = await this.workspaceModel.findById(taskData.workspaceID);
            if (!workspace) {
                return {status: 400, message: "Workspace not found!"}
            }
        
            // to ensure that there are no duplicates
            const assignees = [...new Set(taskData.assignees)]; 
            taskData.assignees = assignees;
            taskData.workspaceID = workspace._id;
        
            const savedTask = await this.taskModel.create(taskData);
            if (!savedTask) {
                return {status: 422, message: "Couldn't create task"}
            }
         
            const newTaskResponse = await savedTask.populate('assignees'); 
            
            return {status: 201, task: newTaskResponse}
    
        } catch (error) {

            console.log(error) 
            return {status: 500, message: "Internal Server Error"} 

        }
        
    }

    /**
     * Updates an existing task identified by taskID with the provided task data.
     * Performs input validation and handles due date comparisons.
     * @param taskID The ID of the task to update.
     * @param taskData The new data for updating the task.
     * @returns A promise that resolves with the task update result.
     */
    async updateTask(taskID: string, taskData) {

        try {
            
            let updateData = {...taskData}; 
            let dateUpdateWarning = null;

            if (!updateData || Object.keys(updateData).length === 0) {
                return {status: 400, message: "Task Update Data is required"} 
            }

            if (!taskID || !mongoose.Types.ObjectId.isValid(taskID)) {
                return {status: 400, message: "Task ID invalid"} 
            }
    
            if ('dueDate' in updateData) {
                const dueDate = new Date(updateData.dueDate); // Assuming updateData.dueDate is in the format of dd-mm-yyyy
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0); // Reset time to the start of the day for comparison.
        
                if (isNaN(dueDate.getTime()) || dueDate < currentDate) {
                    dateUpdateWarning = 'Due date is in the past and was not updated.';
                    delete updateData.dueDate;   
                }
            }

            const updatedTask = await this.taskModel.findByIdAndUpdate(taskID, updateData, { new: true });

            if (!updatedTask) { 
                return {status: 422, message: "Task Update Failed"}; 
            }
        
            return { status: 200, task: updatedTask, warning: dateUpdateWarning } 

        } catch (error) {
            console.log(error) 
            return {status: 500, message: "Internal Server Error"} 
        } 
    }

    /**
     * Deletes a task identified by the given taskID.
     * Validates the task ID before attempting deletion.
     * @param taskID The ID of the task to delete.
     * @returns A promise that resolves with the task deletion result.
     */
    async deleteTask(taskID: string): Promise<any> {

        try { 
            if (!taskID || !mongoose.Types.ObjectId.isValid(taskID)) {
                return {status: 400, message: "Task ID invalid"}
            }

            const deletedTask = await this.taskModel.findByIdAndDelete(taskID);

            if (!deletedTask) {
                return {status: 422, message: "Task Deletion Failed"};  
            }

            return {status: 200, deletedTask};

        } catch (error) {
            console.log(error) 
            return {status: 500, message: "Internal Server Error"} 
        } 

    }

    /**
     * Creates a new subtask in a task identified by taskID.
     * Validates the task ID and adds a default subtask.
     * @param taskID The ID of the task to add a subtask to.
     * @returns A promise that resolves with the subtask creation result.
     */
    async createSubtask(taskID: string): Promise<any> {

        try {

            if (!taskID || !mongoose.Types.ObjectId.isValid(taskID)) {
                return {status: 400, message: "Task ID invalid"}
            }
        
            const task = await this.taskModel.findById(taskID);
            if (!task) {
                return {status: 401, message: "Task not found"}
            }
        
            const subtask: any = {
                name: 'New Subtask',
                isCompleted: false
            };
        
            task.subtasks.push(subtask);
        
            const updatedTask = await task.save();
        
            if (!updatedTask) { 
                return {status: 422, message: "Subtask Creation Failed"}; 
            }
        
            return {status: 200, updatedTask};

        }  catch (error) {

            console.log(error) 
            return {status: 500, message: "Internal Server Error"} 

        } 
    }

    /**
     * Updates a subtask of a task identified by taskID based on the provided task data.
     * Validates the task ID and subtask ID, and then applies the updates.
     * @param taskID The ID of the task containing the subtask.
     * @param taskData The updates for the subtask, including subtask ID and update details.
     * @returns A promise that resolves with the subtask update result.
     */
    async updateSubtask(taskID: string, taskData: any): Promise<any> {
        try {

            const subtaskID = taskData.subtaskID;
            const subtaskUpdates = taskData.updates;

            if (!taskID || !mongoose.Types.ObjectId.isValid(taskID)) {
                return {status: 400, message: "Task ID invalid"}
            }

            const task = await this.taskModel.findById(taskID);
            if (!task) {
                return {status: 404, message: "Task not found"}
            }

            const subtask = task.subtasks.find(sub => sub._id.toString() === subtaskID);
            if (!subtask) {
                return {status: 404, message: "Subtask not found"}
            }

            Object.keys(subtaskUpdates).forEach(key => {
                if (subtask[key] !== undefined) {
                    subtask[key] = subtaskUpdates[key];
                }
            });

            const updatedTask = await task.save();
        
            if (!updatedTask) { 
                return {status: 422, message: "Subtask Update Failed"}; 
            }
        
            return {status: 200, updatedTask};
        }  catch (error) {
            console.log(error) 
            return {status: 500, message: "Internal Server Error"} 
        } 

    }
}
