import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service'; 
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { WorkspaceSchema } from 'src/workspace/schemas/workspace.schema';
import { TaskSchema } from 'src/task/schemas/task.schema';

@Module({
  
  imports: [MongooseModule.forFeature([{name: 'User', schema: UserSchema}]), 
            MongooseModule.forFeature([{name: 'Workspace', schema: WorkspaceSchema}]),
            MongooseModule.forFeature([{name: 'Task', schema: TaskSchema}])],

  controllers: [UserController],

  providers: [UserService]

})
export class UserModule {}
