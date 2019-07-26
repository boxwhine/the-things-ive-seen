import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Field, Int, ObjectType } from 'type-graphql';
import Venue from './Venue';

@Table({
  timestamps: true,
})
@ObjectType()
export default class Event extends Model<Event> {
  @Column
  @Field(type => Date)
  date: Date;

  @Column
  @Field(type => Int, { nullable: true })
  faceValue?: number;

  @Column
  @Field({ nullable: true })
  festivalName?: string;

  @Column
  @Field({ nullable: true })
  genre?: string;

  @Column
  @Field()
  name: string;

  @Column
  @Field({ nullable: true })
  subGenre?: string;

  @Column
  @ForeignKey(() => Venue)
  venueId: number;
  
  @Column
  @Field({ nullable: true })
  wasOpener?: boolean;

  /**
   * Fields only, no db col
   */

  @Field()
  @BelongsTo(() => Venue, 'venueId')
  venue: Venue;
};
