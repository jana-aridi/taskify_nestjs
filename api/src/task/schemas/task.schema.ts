import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Subtask, SubtaskSchema } from './subtask.schema';

@Schema()
export class Task extends Document {
    @Prop({ default: "New Task" })
    name: string;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], required: true, default: [], ref: 'User' })
    assignees: mongoose.Schema.Types.ObjectId[];

    @Prop({ default: false, required: true })
    isCompleted: boolean;

    @Prop({ default: null })
    dueDate: string;

    @Prop({ type: String, ref: 'Workspace', required: true })
    workspaceID: string;

    @Prop({ type: [SubtaskSchema], default: [] })
    subtasks: Subtask[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
