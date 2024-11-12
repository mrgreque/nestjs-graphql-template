import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DefaultOperationResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  errorMessage?: string;
}

@InputType()
export class DefaultPaginationInput {
  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;
}

@ArgsType()
export class ByIdInput {
  @Field(() => String)
  id: string;
}
