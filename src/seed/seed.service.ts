import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>, // solo aqui se hacen injecciones de dependencias
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({}); // delete from * pokemon
    const { data } = await this.axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    const insertPromisesArray = [];

    data.results.forEach( ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      //const pokemon = await this.pokemonModel.create({name, no});
      insertPromisesArray.push(this.pokemonModel.create({ name, no }));
    });

    await Promise.all(insertPromisesArray);

    return 'Seed Executed';
  }
}
