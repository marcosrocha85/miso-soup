import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Anime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  crunchyrollId: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  synopsis: string;

  @Column('simple-array')
  genres: string[]; // e.g. ['action', 'drama']

  @Column('simple-array')
  keywords: string[]; // from questionnaire mapping
}
