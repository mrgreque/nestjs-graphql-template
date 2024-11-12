import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';

@ObjectType()
export class TokenResponse {
  @Field(() => String)
  @IsString()
  token: string;

  @Field(() => String)
  @IsString()
  refreshToken: string;
}

@ArgsType()
export class LoginInput {
  @Field(() => String)
  @IsString()
  email: string;

  @Field(() => String)
  @IsString()
  @MaxLength(32)
  password: string;
}

@ArgsType()
export class RefreshTokenInput {
  @Field(() => String)
  @IsString()
  token: string;
}
