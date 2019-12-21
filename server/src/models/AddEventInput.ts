import { Field, Float, Int, InputType } from 'type-graphql';

import Event from './Event';

@InputType({ description: 'New event data' })
export default class AddEventInput implements Partial<Event> {
  @Field()
  date: Date;

  @Field(type => Float, { nullable: true })
  faceValue?: number;

  @Field({ nullable: true })
  festivalName?: string;

  @Field(type => Int)
  genreId: number;

  @Field(type => Int, { nullable: true })
  subGenreId?: number;

  @Field()
  name: string;

  @Field(type => Int)
  venueId: number;

  @Field({ nullable: true })
  wasOpener?: boolean;
}
