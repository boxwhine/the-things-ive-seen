import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Field, Int, ObjectType } from 'type-graphql';

import Event from './Event';

@Table({
  timestamps: true,
})
@ObjectType()
export default class Venue extends Model<Event> {
  @Column
  @Field()
  address: string;

  @Column
  @Field()
  city: string;

  @Column
  @Field(type => Int, { nullable: true })
  lat: number;

  @Column
  @Field(type => Int, { nullable: true })
  lng: number;

  @Column
  @Field()
  name: string;

  @Column
  @Field({ nullable: true })
  placeId?: string;

  @Column
  @Field()
  state: string;

  /**
   * Fields only, no db col
   */

  @Field(type => [Event], { nullable: true })
  @HasMany(() => Event, 'venueId')
  events: Event[];
};
