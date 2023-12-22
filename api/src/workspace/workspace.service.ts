import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Workspace } from './schemas/workspace.schema';
import { Task } from 'src/task/schemas/task.schema';

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,

        @InjectModel(Workspace.name)
        private workspaceModel: mongoose.Model<Workspace>,

        @InjectModel(Task.name)
        private taskModel: mongoose.Model<Task>,
 
    ) {}

    /**
     * Retrieves all employees of a given workspace.
     * @param workspaceID The ID of the workspace.
     * @returns Promise resolving to an object with the status and list of employees or an error message.
     */
    async getAllWorkspaceEmployees(workspaceID: string): Promise<any> {
        try {

            const workspace = await this.workspaceModel.findById(workspaceID);

            if (!workspace) {
                return {status: 404, message: "Workspace Not Found!"};
            }
            
            const employees =  await this.userModel.find({ _id: { $in: workspace.employees
            }}).select('_id firstName lastName email');
    
            return {status: 200, employees};

        }  catch (error) {
            console.log(error) 
            return {status: 500, message: "Internal Server Error"} 
        } 
    }

    /**
     * Retrieves all workspaces and their associated user data.
     * @returns Promise resolving to an object with the status and detailed information of all workspaces or an error message.
     */
    async getAllWorkspaces(): Promise<any> {
        try {
            const workspaces = await this.workspaceModel.find({}).lean();
            const workspacesWithUserData = [];

            for (const workspace of workspaces) { 

                const workspaceWithUserData = {
                    _id: workspace._id,
                    adminData: {},
                    employeesData: []
                };
    
                const admin = await this.userModel.findById(workspace.admin).select('id firstName lastName email').lean();
                workspaceWithUserData.adminData = admin;

                for (const employeeId of workspace.employees) {

                    const employee = await this.userModel.findById(employeeId).select('firstName lastName email').lean(); 
                    workspaceWithUserData.employeesData.push(employee);
                }

                workspacesWithUserData.push(workspaceWithUserData);
            }

            return {status: 200, workspaces: workspacesWithUserData};

        }  catch (error) {
            console.log(error) 
            return {status: 500, message: "Internal Server Error"} 
        } 
    }

    /**
     * Retrieves employees from a workspace excluding a specific user.
     * @param workspaceID The ID of the workspace.
     * @param userID The ID of the user to be excluded from the list.
     * @returns Promise resolving to an object with the status and list of employees excluding the specified user or an error message.
     */
    async getOtherWorkspaceEmployees(workspaceID: string, userID: string): Promise<any> { 
        try {

            const user = await this.userModel.findById(userID);

            if (!user)
                return {status: 400, message: "User Invalid!"};

            const workspace = await this.workspaceModel.findById(workspaceID);
            if (!workspace)
                return {status: 404, message: "Workspace Not Found!"};

            const employees =  await this.userModel.find({
                _id: { $in: workspace.employees, $ne: userID }
            }).select('_id firstName lastName email');

            return {status: 200, employees};
        
        }  catch (error) {
            console.log(error) 
            return {status: 500, message: "Internal Server Error"} 
        } 
    }

    /**
     * Removes a user from a workspace.
     * Updates the workspace by removing the user and also updates the user and task models accordingly.
     * @param workspaceID The ID of the workspace.
     * @param userID The ID of the user to be removed.
     * @returns Promise resolving to an object with the status of the operation and a message.
     */
    async removeUserFromWorkspace(workspaceID: string, userID: string): Promise<any> {
        try {
            const workspace = await this.workspaceModel.findById(workspaceID);
            const user = await this.userModel.findById(userID);

            if (!workspace) 
                return {status: 404, message: "Workspace Not Found!"};

            if (!user)
                return {status: 400, message: "User Invalid!"};

            await this.workspaceModel.updateOne({ _id: workspaceID }, { $pull: { employees: userID } });
            await this.userModel.findByIdAndUpdate(userID, { workspaceID: null });
            await this.taskModel.updateMany({ assignees: userID }, { $pull: { assignees: userID } });

            return {status: 200, message: "Deletion Successsful!"};
        }  catch (error) {
            console.log(error) 
            return {status: 500, message: "Internal Server Error"} 
        } 
    }
}
