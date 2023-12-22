import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';
import * as jwt from 'jsonwebtoken'

@Controller('')
export class UserController {
    constructor(private userService: UserService){}
    
    /**
     * POST /login
     * Authenticates a user based on email and password.
     * Generates and returns a JWT token upon successful authentication.
     * @param body Contains the email and password of the user.
     * @param res The Express response object.
     * @returns A response with the authentication status, message, token, and user data.
     */
    @Post('login')
    async login(@Body() body, @Res() res: Response) {
        try {

            const result = await this.userService.login(body.email, body.password);

            if(result.status === 200) { 
                const token = jwt.sign({_id: result.user._id}, process.env.SECRET_KEY, {expiresIn: '7d'});
                res.status(200).json({message: result.message, token, user: result.user}); 
            }
            
            else
                res.status(result.status).json({message: result.message});
            
        }
        catch(error) {

            res.status(500).json({message: 'Internal server error'});

        }
    }

    /**
     * POST /register
     * Registers a new user with the provided user data.
     * @param body Contains the data for the new user.
     * @param res The Express response object.
     * @returns A response with the registration status and message.
     */
    @Post('register')
    async register(@Body() body, @Res() res: Response) {
        try {
            const result = await this.userService.register(body);
            res.status(result.status).json({ message: result.message });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * PUT /users/joinWorkspace/:userID
     * Adds a user to a workspace.
     * @param userID The ID of the user to join a workspace.
     * @param body Contains the workspace details.
     * @param res The Express response object.
     * @returns A response with the status of joining the workspace and a message.
     */
    @Put('/users/joinWorkspace/:userID')
    async joinWorkspace(@Param('userID') userID: string, @Body() body, @Res() res: Response) {
        try { 

            const result = await this.userService.joinWorkspace(userID, body);
            console.log(result)
            res.status(result.status).json({ message: result.message });
            
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * DELETE /users/:userID
     * Deletes a user identified by userID.
     * @param userID The ID of the user to delete.
     * @param res The Express response object.
     * @returns A response with the status of the user deletion and a message.
     */
    @Delete('/users/:userID')
    async deleteUser(@Param('userID') userID: string, @Res() res: Response): Promise<any> {
        try {
            const result = await this.userService.deleteUser(userID);
            res.status(result.status).json({ message: result.message });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * GET /users/getTasks/:userID
     * Retrieves tasks associated with a user.
     * @param userID The ID of the user whose tasks are to be retrieved.
     * @param res The Express response object.
     * @returns A response with the status, user tasks, and a message.
     */
    @Get('/users/getTasks/:userID')
    async getUserTasks(@Param('userID') userID: string, @Res() res: Response): Promise<any> {
        try {
            const result = await this.userService.getUserTasks(userID); 

            if (result.status === 200)

                res.status(result.status).json(result.tasks);

            else

                res.status(result.status).json({ message: result.message });

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

}
