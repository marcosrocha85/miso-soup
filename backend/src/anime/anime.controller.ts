import { Controller, Post, Body } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { MBTI_KEYWORDS } from './mbti-keywords';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Post('recommend')
  async recommend(@Body() body: { answers: string[] }): Promise<any> {
    // Calculate MBTI type from answers
    const mbtiType = this.calculateMBTI(body.answers);
    // Map MBTI type to keywords
    const keywords = this.mapMBTIToKeywords(mbtiType);
    return this.animeService.getRecommendations(keywords);
  }

  private calculateMBTI(answers: string[]): string {
    if (answers.length !== 10) {
      throw new Error('Expected 10 answers for MBTI calculation');
    }

    // Count votes for each dichotomy
    // Questions mapping:
    // 0, 4, 8: E/I (E=0, I=1)
    // 1, 5, 9: S/N (S=0, N=1)
    // 2, 6: T/F (T=0, F=1)
    // 3, 7: J/P (J=0, P=1)

    const eiVotes = [answers[0], answers[4], answers[8]];
    const snVotes = [answers[1], answers[5], answers[9]];
    const tfVotes = [answers[2], answers[6]];
    const jpVotes = [answers[3], answers[7]];

    const ei = eiVotes.filter((v) => v === '1').length >= 2 ? 'I' : 'E';
    const sn = snVotes.filter((v) => v === '1').length >= 2 ? 'N' : 'S';
    const tf = tfVotes.filter((v) => v === '1').length >= 1 ? 'F' : 'T';
    const jp = jpVotes.filter((v) => v === '1').length >= 1 ? 'P' : 'J';

    return `${ei}${sn}${tf}${jp}`;
  }

  private mapMBTIToKeywords(mbtiType: string): string[] {
    return MBTI_KEYWORDS[mbtiType] || [];
  }
}
