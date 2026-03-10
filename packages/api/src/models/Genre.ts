import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export default class Genre {
  @Field((type) => Int)
  id: number;

  @Field()
  name: string;

  @Field((type) => Int, { nullable: true })
  parentId?: number;

  @Field((type) => [Genre], { nullable: true })
  subGenres?: Genre[];
}
