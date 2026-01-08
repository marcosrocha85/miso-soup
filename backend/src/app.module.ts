import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Anime } from './anime/entities/anime/anime';
import { AnimeService } from './anime/anime.service';
import { AnimeController } from './anime/anime.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_DATABASE || 'miso_soup',
      entities: [Anime],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Anime]),
  ],
  controllers: [AppController, AnimeController],
  providers: [AppService, AnimeService],
})
export class AppModule {}
