import { Field, Int, ObjectType } from 'type-graphql';
import Venue from './Venue';

@ObjectType()
export default class Event {
  @Field(type => Int)
  id: number;

  // @Field(type => Date)
  // date: Date;

  // @Field(type => Int)
  // faceValue: number;

  @Field({ nullable: true })
  festivalName?: string;

  // @Field()
  // genre: string = '';

  @Field()
  name: string = '';

  // @Field()
  // subGenre: string = '';

  @Field(type => Venue)
  venue: Venue;

  // @Field()
  // wasOpener: boolean = false;
};
