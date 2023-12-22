import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Subtask extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ default: false })
    isCompleted: boolean;
}

export const SubtaskSchema = SchemaFactory.createForClass(Subtask);
