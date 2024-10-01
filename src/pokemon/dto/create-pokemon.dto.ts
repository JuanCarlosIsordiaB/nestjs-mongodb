import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsPositive()
    @IsInt()
    @Min(1)
    no: number;

    @MinLength(3)
    @IsString()
    name: string;
}
