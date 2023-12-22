import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { CreateTaskDto } from 'dto/task.dto';
import { TaskService } from './task.service';
import { Response } from 'express';

@Controller('tasks')
export class TaskController {

    constructor(private taskService: TaskService){}

    /**
     * POST /tasks/add
     * Creates a new task based on the provided CreateTaskDto.
     * @param createTaskDto The task details for creating a new task.
     * @param res The Express response object.
     * @returns The created task or an error message on failure.
     */
    @Post('add')
    async createTask(@Body() createTaskDto: CreateTaskDto, @Res() res: Response): Promise<any> {
        try {
            const result = await this.taskService.createTask(createTaskDto);

            if (result.status === 201) {

                res.status(result.status).json( result.task );
            }

            else
                res.status(result.status).json({ message: result.message });

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * PUT /tasks/update/:taskID
     * Updates an existing task identified by taskID with the provided task data.
     * @param taskID The ID of the task to update.
     * @param taskData The new data for updating the task.
     * @param res The Express response object.
     * @returns The updated task or an error message on failure.
     */
    @Put('update/:taskID')
    async updateTask(@Param('taskID') taskID, @Body() taskData, @Res() res): Promise<any> {
        try {

            const result = await this.taskService.updateTask(taskID, taskData);

            if (result.status === 200) {
                if (result.warning) {
                    res.status(200).json({ task: result.task, warning: result.warning });
                } else {
                    res.status(200).json({ task: result.task });
                }
            } else {
                res.status(result.status).json({ message: result.message });
            }

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * DELETE /tasks/delete/:taskID
     * Deletes an existing task identified by taskID.
     * @param taskID The ID of the task to delete.
     * @param res The Express response object.
     * @returns Confirmation of the deleted task or an error message on failure.
     */
    @Delete('delete/:taskID')
    async deleteTask(@Param('taskID') taskID: string, @Res() res): Promise<any> {
        try {
            const result = await this.taskService.deleteTask(taskID);

            if (result.status === 200)
                res.status(200).json(result.deletedTask);

            else
                res.status(result.status).json({ message: result.message });

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * PUT /tasks/addSubtask/:taskID
     * Adds a subtask to an existing task identified by taskID.
     * @param taskID The ID of the task to add a subtask to.
     * @param res The Express response object.
     * @returns The updated task with the new subtask or an error message on failure.
     */
    @Put('addSubtask/:taskID')
    async createSubtask(@Param('taskID') taskID: string, @Res() res: Response): Promise<any> {
        try {
            const result = await this.taskService.createSubtask(taskID);

            if (result.status === 200) {

                res.status(result.status).json({ updatedTask: result.updatedTask });
            }

            else
                res.status(result.status).json({ message: result.message });

        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * PUT /tasks/updateSubtask/:taskID
     * Updates a subtask of an existing task identified by taskID.
     * @param taskID The ID of the task whose subtask is to be updated.
     * @param taskData The new data for the subtask.
     * @param res The Express response object.
     * @returns The updated task with the updated subtask or an error message on failure.
     */
    @Put('updateSubtask/:taskID')
    async updateSubtask(@Param('taskID') taskID: string, @Body() taskData: any, @Res() res: Response): Promise<any> {
        try {
            const result = await this.taskService.updateSubtask(taskID, taskData);

            if (result.status === 200) {

                res.status(result.status).json({ updatedTask: result.updatedTask });
            }

            else
                res.status(result.status).json({ message: result.message });

        } catch (error) {

            res.status(500).json({ message: 'Internal server error' });
        
        }
    }
    
    
}
