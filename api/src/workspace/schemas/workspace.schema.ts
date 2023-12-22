import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";  
import mongoose from "mongoose"; 

@Schema({
    timestamps: false,
})

export class Workspace {
    
    @Prop({required: true})
    _id: string;

    @Prop({required: true, ref: 'User'})
    admin: mongoose.Schema.Types.ObjectId;

    @Prop({required: true, ref: 'User', default: []})
    employees: mongoose.Schema.Types.ObjectId[];
    
}


export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);