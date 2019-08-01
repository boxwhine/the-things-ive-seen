import { Table, Column, Model, ForeignKey, HasMany } from 'sequelize-typescript';
import { Field, Int, ObjectType } from 'type-graphql';

import Event from './Event';

@Table({
  timestamps: true,
})
@ObjectType()
export default class Genre extends Model<Genre> {
  @Column
  @Field()
  name: string;

  @Column
  @Field(type => Int, { nullable: true })
  @ForeignKey(() => Genre)
  parentId?: number;

  /**
   * Fields only, no db col
   */

  @Field(type => Int)
  id: number;

  @Field(type => [Genre], { nullable: true })
  @HasMany(() => Genre, 'parentId')
  subGenres?: Genre[];

  // @Field(type => [Event], { nullable: true })
  // @HasMany(() => Event, 'venueId')
  // events: Event[];
};
