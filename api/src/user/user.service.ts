import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Types } from 'mongoose';
import * as bcrypt from 'bcrypt'; 
import { v4 as uuidv4 } from 'uuid';
import { Workspace } from 'src/workspace/schemas/workspace.schema';
import { Task } from 'src/task/schemas/task.schema';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name)
        private userModel: mongoose.Model<User>,

        @InjectModel(Workspace.name)
        private workspaceModel: mongoose.Model<Workspace>,

        @InjectModel(Task.name)
        private taskModel: mongoose.Model<Task>

    ) {}

    /**
     * Authenticates a user using email and password.
     * Validates the email and password, checks the credentials, and returns login status.
     * @param email User's email.
     * @param password User's password.
     * @returns Promise resolving to an object with login status, message, and user data.
     */
    async login(email: string, password: string): Promise<any> {
        try {

            if(!email || !password){
                return {status: 400, message: "Email and password required"};
            }

            const user = await this.userModel.findOne({ email }).exec();

            if (!user) {
                return {status: 400, message: "Invalid user or password"};
            }

            const validPass = await bcrypt.compare(password, user.password);

            if (!validPass) {
                return {status: 401, message: "Invalid user or password"};
            }

            return {
                status: 200,
                message: "Login Successful",
                user
            }

        } catch (error) {
            
            return {status: 500, message: "Internal Server Error"}
            
        }
    }

    /**
     * Registers a new user with the provided data.
     * Checks for existing users with the same email and encrypts the password before saving.
     * @param data Object containing user registration details.
     * @returns Promise resolving to an object with registration status, message, and user data.
     */
    async register(data: any): Promise<any> {
        try {
            const { firstName, lastName, email, password, isAdmin } = data;

            if (
            !email ||
            !password ||
            !firstName ||
            !lastName 
            ) {
            return { status: 400, message: 'Please fill out all the fields' };
            }
        
            const existingUser = await this.userModel.findOne({'email': email});

            if (existingUser) {
            return { status: 409, message: 'The email is already in use' };
            }
            
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashedPassword = await bcrypt.hash(password, salt);

            let workspaceID = null;
            if (isAdmin) {
                workspaceID = uuidv4();
            }

            const newUser = new this.userModel({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                isAdmin,
                workspaceID, 
            });
 
            await newUser.save();
 
            if (workspaceID) {
                await this.workspaceModel.create({
                    _id: workspaceID,
                    admin: newUser._id,
                });
            }

            return { status: 201, message: 'User registered', user: newUser };

        } catch (error) {
          console.log(error);
          return { status: 500, message: 'Internal server error' };
        }
    }

    /**
     * Adds a user to a workspace.
     * Validates the workspace ID and updates the workspace and user data.
     * @param userID ID of the user joining the workspace.
     * @param data Object containing the workspace ID.
     * @returns Promise resolving to an object with join workspace status and message.
     */
    async joinWorkspace(userID, data): Promise<any> {
        try {
            if (!data || data.length === 0)
                throw new Error('MissingData')
            
            const workspaceID = data.workspaceID;
            const workspace = await this.workspaceModel.findById(workspaceID);
            
            if (!workspace) {
                return {status: 401, message: "Invalid Workspace ID"};
            }
            
            const userObjectID = new Types.ObjectId(userID);
            const updatedWorkspace = await this.workspaceModel.findByIdAndUpdate(
                workspaceID,
                { $addToSet: { employees: userObjectID } },
                { new: true }
            );
        
            if (!updatedWorkspace) {
                return {status: 401, message: "Couldn't join workspace!"};
            }
        
            const updatedUser = await this.userModel.findByIdAndUpdate(userID, data, { new: true }); 
            
            if (!updatedUser)
                return {status: 401, message: "Invalid user!"};
        
            return {status: 200, message: "Joined Workspace Successfully!"};
        }
        catch(error) {
            console.log(error);
            return { status: 500, message: 'Internal server error' };
        }
    }  
    
    /**
     * Deletes a user identified by userID.
     * @param userID ID of the user to be deleted.
     * @returns Promise resolving to an object with user deletion status and message.
     */
    async deleteUser(userID): Promise<any> {
        try {
            await this.userModel.findByIdAndDelete(userID);

            return { status: 201, message: "User deleted successfully" };
        }
        catch(error) {
            console.log(error);
            return { status: 500, message: 'Internal server error' };
        }
    }

    /**
     * Retrieves tasks associated with a user.
     * Validates the user ID and fetches tasks where the user is an assignee.
     * @param userID ID of the user whose tasks are to be retrieved.
     * @returns Promise resolving to an object with user tasks and status.
     */
    async getUserTasks(userID): Promise<any> {
        try {

            const user = await this.userModel.findById(userID);

            if (!user)
                return {status: 401, message: "Invalid user!"};
            
            const tasks = await this.taskModel.find({ assignees: userID }).populate('assignees'); 
 
            return {status: 200, tasks};
        }
        catch(error) {
            console.log(error);
            return { status: 500, message: 'Internal server error' };
        }
    }
}
