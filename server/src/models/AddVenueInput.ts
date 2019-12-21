import { Field, InputType, Float } from 'type-graphql';

import Venue from './Venue';

@InputType({ description: 'New venue data' })
export default class AddVenueInput implements Partial<Venue> {
  @Field()
  address: string;

  @Field()
  city: string;

  @Field(type => Float, { nullable: true })
  lat: number;

  @Field(type => Float, { nullable: true })
  lng: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  placeId?: string;

  @Field()
  state: string;
}
