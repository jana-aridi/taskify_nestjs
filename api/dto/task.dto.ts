import { IsString, IsArray, IsOptional, IsBoolean, IsMongoId } from 'class-validator';

export class CreateTaskDto {

    @IsString()
    @IsOptional()
    name?: string;

    @IsString() 
    workspaceID?: string;

    @IsString()
    @IsOptional()
    dueDate?: string;

    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    assignees?: string[]; 
    
}
