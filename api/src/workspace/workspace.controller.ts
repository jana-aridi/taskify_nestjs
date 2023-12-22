import { Controller, Delete, Get, Param, Res } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { Response } from 'express';

@Controller('workspaces')
export class WorkspaceController {
    
    constructor(private workspaceService: WorkspaceService) {}

    /**
     * GET /workspaces/:workspaceID/employees
     * Retrieves all employees of a given workspace.
     * @param workspaceID The ID of the workspace.
     * @param res The Express response object.
     * @returns A response with the status and the list of employees or an error message.
     */
    @Get(':workspaceID/employees')
    async getAllWorkspaceEmployees(@Param('workspaceID') workspaceID: string, @Res() res: Response) {
        try {
            const result = await this.workspaceService.getAllWorkspaceEmployees(workspaceID);
            if (result.status === 200)

                res.status(result.status).json(result.employees);

            else

                res.status(result.status).json({ message: result.message }); 

        } catch (error) { 
            
            res.status(500).json({message: 'Internal server error'});

        }
    }

    /**
     * GET /workspaces
     * Retrieves all workspaces.
     * @param res The Express response object.
     * @returns A response with the status and the list of all workspaces or an error message.
     */
    @Get()
    async getAllWorkspaces(@Res() res: Response) {
        try {
            const result =  await this.workspaceService.getAllWorkspaces();

            if (result.status === 200)
                res.status(200).json(result.workspaces)

            else
                res.status(result.status).json({message: result.message});
            
        } catch (error) {
            res.status(500).json({message: 'Internal server error'});
            console.log(error)
        }
    }

    /**
     * GET /workspaces/:workspaceID/employees/:userID
     * Retrieves employees from a workspace excluding a specific user.
     * @param workspaceID The ID of the workspace.
     * @param userID The ID of the user to be excluded from the list.
     * @param res The Express response object.
     * @returns A response with the status and the list of employees excluding the specified user or an error message.
     */
    @Get(':workspaceID/employees/:userID')
    async getOtherWorkspaceEmployees(@Param('workspaceID') workspaceID: string, @Param('userID') userID: string, @Res() res: Response) {
        try {
            const result = await this.workspaceService.getOtherWorkspaceEmployees(workspaceID, userID);

            if (result.status === 200) 
                res.status(200).json(result.employees)

            else
                res.status(result.status).json({message: result.message});

        } catch (error) {
            console.log(error)
            res.status(500).json({message: 'Internal server error'});
        }
    }

    /**
     * DELETE /workspaces/:workspaceID/employees/:userID
     * Removes a user from a workspace.
     * @param workspaceID The ID of the workspace.
     * @param userID The ID of the user to be removed.
     * @param res The Express response object.
     * @returns A response with the status of the removal operation and a message.
     */
    @Delete(':workspaceID/employees/:userID')
    async removeUserFromWorkspace(@Param('workspaceID') workspaceID: string, @Param('userID') userID: string, @Res() res: Response) {
        try {
            const result = await this.workspaceService.removeUserFromWorkspace(workspaceID, userID);

            res.status(result.status).json({message: result.message});

        } catch (error) {
            res.status(500).json({message: 'Internal server error'});
        }
    }
}