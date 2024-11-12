import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloServerPluginInlineTraceDisabled, ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: { path: join(process.cwd(), 'src/schema.gql'), federation: 2 },
      sortSchema: true,
      introspection: true,
      playground: false,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }) as any,
        ApolloServerPluginInlineTraceDisabled() as any,
      ],
    }),
  ],
  controllers: [],
  providers: [],
})
export class GraphQLFederationModule {}
