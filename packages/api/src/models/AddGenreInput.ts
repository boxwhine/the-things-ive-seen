import { Field, Int, InputType } from 'type-graphql';

import Genre from './Genre';

@InputType({ description: 'New genre data' })
export default class AddGenreInput implements Partial<Genre> {
  @Field()
  name: string;

  @Field(type => Int, { nullable: true })
  parentId?: number;
}
