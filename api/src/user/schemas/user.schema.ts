import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"; 

@Schema({
    timestamps: false,
})

export class User {

    @Prop({required: true})
    firstName: string;
    
    @Prop({required: true})
    lastName: string;
    
    @Prop({required: true, unique: true})
    email: string;
    
    @Prop({required: true})
    password: string;

    @Prop({required: true, default: false})
    isAdmin: boolean;

    @Prop({required: true, default: false})
    isSuperAdmin: boolean; 
    
    @Prop({default: null, ref: 'Workspace'})
    workspaceID: string;
    
}


export const UserSchema = SchemaFactory.createForClass(User);