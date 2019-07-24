import { Table, Column, Model, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Field, Int, ObjectType } from 'type-graphql';
import Venue from './Venue';

@Table({
  timestamps: true,
})
@ObjectType()
export default class Event extends Model<Event> {
  // @Field(type => Date)
  // date: Date;

  // @Field(type => Int)
  // faceValue: number;

  @Column
  @Field({ nullable: true })
  festivalName?: string;

  // @Field()
  // genre: string = '';

  @Column
  @Field()
  name: string = '';

  // @Field()
  // subGenre: string = '';

  // @Column
  // @Field(type => Venue)
  // venue: Venue;

  @ForeignKey(() => Venue)
  @Column
  venueId: number;
  
  @BelongsTo(() => Venue)
  venue: Venue;

  // @HasMany(() => Hobby)
  // hobbies: Hobby[];

  // @Field()
  // wasOpener: boolean = false;
};
