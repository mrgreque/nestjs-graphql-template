import { Field, InputType, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class Application {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String)
  name: string;
}

@ObjectType()
export class CreateApplicationResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  errorMessage?: string;
}

@InputType()
export class CreateApplicationInput {
  @Field(() => String)
  name: string;
}

@InputType()
export class UpdateApplicationInput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  name: string;
}

@ObjectType()
export class UpdateApplicationResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => String, { nullable: true })
  errorMessage?: string;

  @Field(() => Application, { nullable: true })
  application?: Application;
}

@ObjectType()
export class FindApplicationsOutput {
  @Field(() => Number)
  records: number;

  @Field(() => Boolean)
  hasNext: boolean;

  @Field(() => [Application])
  applications: Application[];
}
