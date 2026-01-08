import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Anime } from './entities/anime/anime';
import * as Crunchyroll from 'crunchyroll-js-api';
import fuzzysort from 'fuzzysort';

interface AnimeData {
  crunchyrollId: string;
  title: string;
  synopsis: string;
  genres: string[];
  keywords: string[];
}

@Injectable()
export class AnimeService {
  constructor(
    @InjectRepository(Anime)
    private animeRepository: Repository<Anime>,
  ) {}

  async getRecommendations(keywords: string[]): Promise<Anime[]> {
    // Fetch all anime from database for fuzzy matching
    const allAnime = await this.animeRepository.find();

    if (allAnime.length === 0) {
      return [];
    }

    // Perform fuzzy matching on synopsis using all keywords
    const scoredAnime = allAnime
      .map((anime) => {
        // Create a combined search target from synopsis and genres
        const searchTarget = `${anime.synopsis || ''} ${anime.genres.join(' ')}`.toLowerCase();

        // Calculate fuzzy match score for each keyword
        let totalScore = 0;
        let matchCount = 0;

        for (const keyword of keywords) {
          const result = fuzzysort.single(keyword.toLowerCase(), searchTarget);
          if (result && result.score > -10000) {
            // fuzzysort uses negative scores (higher is better)
            totalScore += result.score;
            matchCount++;
          }
        }

        // Average score based on matched keywords
        const avgScore = matchCount > 0 ? totalScore / keywords.length : -Infinity;

        return {
          anime,
          score: avgScore,
          matchCount,
        };
      })
      .filter((item) => item.matchCount > 0) // Only include anime with at least one keyword match
      .sort((a, b) => b.score - a.score) // Sort by score (highest first)
      .slice(0, 10) // Take top 10
      .map((item) => item.anime);

    return scoredAnime;
  }

  async saveAnime(data: AnimeData): Promise<Anime> {
    const anime = this.animeRepository.create({
      crunchyrollId: data.crunchyrollId,
      title: data.title,
      synopsis: data.synopsis,
      genres: data.genres,
      keywords: data.keywords,
    });

    return await this.animeRepository.save(anime);
  }
}
