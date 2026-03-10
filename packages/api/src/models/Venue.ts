import { Field, Int, ObjectType } from 'type-graphql';

import Event from './Event';

@ObjectType()
export default class Venue {
  @Field(type => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field(type => Int, { nullable: true })
  lat?: number;

  @Field(type => Int, { nullable: true })
  lng?: number;

  @Field({ nullable: true })
  placeId?: string;

  @Field(type => [Event], { nullable: true })
  events?: Event[];
}
