import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubtaskSchema } from './schemas/subtask.schema';
import { TaskSchema } from './schemas/task.schema';
import { UserSchema } from 'src/user/schemas/user.schema';
import { WorkspaceSchema } from 'src/workspace/schemas/workspace.schema';

@Module({

  imports: [MongooseModule.forFeature([{name: 'Subtask', schema: SubtaskSchema}]), 
            MongooseModule.forFeature([{name: 'Task', schema: TaskSchema}]),
            MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
            MongooseModule.forFeature([{name: 'Workspace', schema: WorkspaceSchema}])],

  providers: [TaskService],

  controllers: [TaskController]
  
})
export class TaskModule {}
