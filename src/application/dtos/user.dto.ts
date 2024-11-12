import { Role } from '@/core/types';
import { Field, HideField, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';

registerEnumType(Role, {
  name: 'UserRoles',
});

@ObjectType()
export class Session {
  @Field(() => String)
  @IsString()
  token: string;

  @Field(() => String, { nullable: true })
  @IsString()
  refreshToken?: string;
}

@ObjectType()
export class User {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String)
  @IsString()
  email: string;

  @HideField()
  @IsString()
  @MaxLength(32)
  password: string;

  @Field(() => Role)
  role: Role;

  @Field(() => Session, { nullable: true })
  session?: Session;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsString()
  email: string;

  @Field(() => String)
  @IsString()
  @MaxLength(32)
  password: string;

  @Field(() => Role)
  role: Role;
}

@ObjectType()
export class CreateUserResponse {
  @Field(() => Boolean)
  success: boolean;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => String, { nullable: true })
  errorMessage?: string;
}
@InputType()
export class UpdateUserInput {
  @Field(() => String)
  id: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  password?: string;

  @Field(() => Role, { nullable: true })
  role?: Role;
}

@ObjectType()
export class UserPagination {
  @Field(() => Boolean)
  hasNext: boolean;

  @Field(() => Number)
  records: number;

  @Field(() => [User])
  users: User[];
}
