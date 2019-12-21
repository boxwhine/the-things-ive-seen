import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { Field, Float, Int, ObjectType } from 'type-graphql';

import Genre from './Genre';
import Venue from './Venue';

@Scopes({
  default: {
    include: [
      {
        model: () => Venue,
      },
      {
        as: 'genre',
        model: () => Genre,
      },
      {
        as: 'subGenre',
        model: () => Genre,
      },
    ],
  },
})
@Table({
  timestamps: true,
})
@ObjectType()
export default class Event extends Model<Event> {
  @Column
  @Field()
  date: Date;

  @Column
  @Field(type => Float, { nullable: true })
  faceValue?: number;

  @Column
  @Field({ nullable: true })
  festivalName?: string;

  @Column
  @ForeignKey(() => Genre)
  genreId: number;

  @Column
  @ForeignKey(() => Genre)
  subGenreId?: number;

  @Column
  @Field()
  name: string;

  @Column
  @ForeignKey(() => Venue)
  venueId: number;

  @Column
  @Field({ nullable: true })
  wasOpener?: boolean;

  /**
   * Fields only, no db col
   */

  @Field(type => Int)
  id: number;

  @Field()
  @BelongsTo(() => Venue, 'venueId')
  venue: Venue;

  @Field()
  @BelongsTo(() => Genre)
  genre: Genre;

  @Field({ nullable: true })
  @BelongsTo(() => Genre, 'subGenreId')
  subGenre?: Genre;
}
