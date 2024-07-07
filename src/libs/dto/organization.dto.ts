import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class OrganisationDto{

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description?: string;
}