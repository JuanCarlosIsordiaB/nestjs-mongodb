import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { PokemonModule } from 'src/pokemon/pokemon.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [PokemonModule]
})
export class SeedModule {}
