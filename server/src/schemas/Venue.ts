import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export default class Venue {
  @Field(type => Int)
  id: number;

  // @Field()
  // address: string = '';

  // @Field()
  // city: string = '';

  // @Field(type => Int)
  // lat: number = -1;

  // @Field(type => Int)
  // lng: number = -1;

  @Field()
  name: string = '';

  // @Field()
  // placeId: string = '';

  @Field()
  state: string = '';

  @Field(type => Int)
  event_id: number;
};
