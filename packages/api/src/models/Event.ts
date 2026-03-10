import { Field, Int, ObjectType } from "type-graphql";

import Genre from "./Genre";
import Venue from "./Venue";

@ObjectType()
export default class Event {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  date: Date;

  @Field((type) => Int, { nullable: true })
  faceValue?: number;

  @Field({ nullable: true })
  festivalName?: string;

  @Field({ nullable: true })
  wasOpener?: boolean;

  @Field((type) => Int)
  venueId: number;

  @Field((type) => Int)
  genreId: number;

  @Field((type) => Int, { nullable: true })
  subGenreId?: number;

  @Field()
  venue: Venue;

  @Field()
  genre: Genre;

  @Field({ nullable: true })
  subGenre?: Genre;
}
