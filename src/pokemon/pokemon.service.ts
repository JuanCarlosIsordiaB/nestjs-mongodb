import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { isNotIn } from 'class-validator';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>, // solo aqui se hacen injecciones de dependencias
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return this.pokemonModel.find();
  }

  async findOne(id: string) {
    let pokemon: Pokemon;

    //Por Id
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: id });
    }

    //MongoId
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }

    // Nombre
    if (!pokemon)
      pokemon = await this.pokemonModel.findOne({
        name: id.toLowerCase().trim(),
      });

    if (!pokemon) {
      throw new NotFoundException(`Pokemon with ID/Name ${id} not found`);
    }
    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto);

      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const {deletedCount, acknowledged} = await  this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0){
      throw new BadRequestException(`Pokemon with ID ${id} not found`)
    } 
    return 'Pokemon Deleted';
    
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon ${JSON.stringify(error.keyvalue)}  already exists`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      'Cant create Pokemon - Check server logs',
    );
  }
}
