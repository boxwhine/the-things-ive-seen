import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Field, Int, ObjectType } from 'type-graphql';

import Event from './Event';

@Table({
  timestamps: true,
})
@ObjectType()
export default class Venue extends Model<Event> {
  // @Field()
  // address: string = '';

  // @Field()
  // city: string = '';

  // @Field(type => Int)
  // lat: number = -1;

  // @Field(type => Int)
  // lng: number = -1;

  @Column
  @Field()
  name: string = '';

  // @Field()
  // placeId: string = '';

  @Column
  @Field()
  state: string = '';

  @HasMany(() => Event)
  events: Event[];
};
