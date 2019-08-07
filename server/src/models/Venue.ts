import { Column, HasMany, Model, Scopes, Table } from 'sequelize-typescript';
import { Field, Int, ObjectType } from 'type-graphql';

import Event from './Event';

@Scopes({
  default: {
    include: [() => Event],
  },
})
@Table({
  timestamps: true,
})
@ObjectType()
export default class Venue extends Model<Venue> {
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

  @Field(type => Int)
  id: number;

  @Field(type => [Event], { nullable: true })
  @HasMany(() => Event, 'venueId')
  events?: Event[];
}
