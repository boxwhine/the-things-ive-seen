import { Field, Int, InputType } from 'type-graphql';

@InputType({ description: 'New genre data' })
export default class AddGenreInput {
  @Field()
  name: string;

  @Field(type => Int, { nullable: true })
  parentId?: number;
}
