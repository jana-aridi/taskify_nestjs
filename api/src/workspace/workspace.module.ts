import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkspaceSchema } from './schemas/workspace.schema';
import { UserSchema } from 'src/user/schemas/user.schema';
import { TaskSchema } from 'src/task/schemas/task.schema';

@Module({
  
  imports: [MongooseModule.forFeature([{name: 'Workspace', schema: WorkspaceSchema}]),
            MongooseModule.forFeature([{name: 'User', schema: UserSchema}]),
            MongooseModule.forFeature([{name: 'Task', schema: TaskSchema}])],

  providers: [WorkspaceService],

  controllers: [WorkspaceController]

})
export class WorkspaceModule {}
