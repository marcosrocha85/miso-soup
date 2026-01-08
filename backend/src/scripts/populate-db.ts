import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AnimeService } from '../anime/anime.service';
import * as Crunchyroll from 'crunchyroll-js-api';

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function populate() {
  console.log('Starting anime catalog population...');

  const app = await NestFactory.createApplicationContext(AppModule);
  const animeService = app.get(AnimeService);

  try {
    // Get Crunchyroll credentials from environment variables
    const token = process.env.CRUNCHYROLL_TOKEN;
    const locale = process.env.CRUNCHYROLL_LOCALE || 'en-US';
    const audioLanguage = process.env.CRUNCHYROLL_AUDIO_LANGUAGE || 'ja-JP';

    if (!token) {
      throw new Error(
        'CRUNCHYROLL_TOKEN environment variable is required. Please provide a valid Crunchyroll premium account token.',
      );
    }

    console.log('Authenticating with Crunchyroll API...');
    console.log(`Locale: ${locale}, Audio Language: ${audioLanguage}`);

    const account = {
      token,
      locale,
      audioLanguage,
    };

    let page = 0;
    const pageSize = 50;
    let hasMore = true;
    let totalSaved = 0;

    while (hasMore) {
      console.log(`\nFetching page ${page + 1} (start: ${page * pageSize})...`);

      try {
        const result = await Crunchyroll.api.discover.getBrowseAll({
          account,
          start: page * pageSize,
          quantity: pageSize,
        });

        if (!result || !result.data || result.data.length === 0) {
          console.log('No more anime data available.');
          hasMore = false;
          break;
        }

        console.log(`Retrieved ${result.data.length} anime from API`);

        for (const item of result.data) {
          try {
            // Extract relevant data
            const crunchyrollId = item.id;
            const title =
              item.title ||
              (item.localization && item.localization.title) ||
              'Unknown Title';
            const synopsis =
              item.description ||
              (item.localization && item.localization.description) ||
              '';
            const genres = item.categories || [];
            const keywords: string[] = [];

            // Save to database
            await animeService.saveAnime({
              crunchyrollId,
              title,
              synopsis,
              genres,
              keywords,
            });

            totalSaved++;
            console.log(`✓ Saved: ${title} (${crunchyrollId})`);
          } catch (error) {
            // Skip duplicates or errors with individual anime
            if (
              error.code === 'ER_DUP_ENTRY' ||
              error.message?.includes('duplicate')
            ) {
              console.log(`⊘ Skipped duplicate: ${item.title || item.id}`);
            } else {
              console.error(
                `✗ Error saving anime ${item.title || item.id}:`,
                error.message,
              );
            }
          }
        }

        console.log(
          `Page ${page + 1} complete. Total saved: ${totalSaved} anime.`,
        );

        // Check if there are more pages
        if (result.data.length < pageSize) {
          console.log('Reached end of catalog (last page was not full).');
          hasMore = false;
        } else {
          page++;
          console.log('Waiting 5 seconds before next request...');
          await sleep(5000);
        }
      } catch (error) {
        console.error(`Error fetching page ${page + 1}:`, error.message);
        console.log('Stopping pagination due to API error.');
        hasMore = false;
      }
    }

    console.log(`\n✓ Population complete! Total anime saved: ${totalSaved}`);
  } catch (error) {
    console.error('Fatal error during population:', error.message);
    process.exit(1);
  } finally {
    await app.close();
  }
}

populate();
