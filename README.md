<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

## Description

This is a template of back-end using **NestJS, GraphQL and MongoDB**.

## Technologies

- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **GraphQL**: API layer with GraphQL (Apollo Server)
- **Testing**: Jest for unit and integration testing
- **Linting and Formatting**: ESLint and Prettier for code quality
- **Project Management**: EditorConfig for consistent code style

## Resources

- **GraphQL API**: Provides a powerful and flexible query language for API requests.
- **User Management**: Create, read, update, and delete users and manage their associated data.
- **Application Management**: Create, read, update, and delete users and manage their associated data.
- **Property Management**: Manage property data with support for relationships to users and applications.
- **Image Handling**: Supports storing and serving images, including metadata.
- **Email Service**: Send emails with customizable content for various user interactions.
- **Soft Delete**: Use soft deletion on resources for easy retrieval of deleted items if necessary.
- **TypeScript for Type Safety**: Leverage TypeScript to ensure type safety throughout the application.
- **Testing with Jest**: Comprehensive test coverage with Jest for unit and integration tests.

## Project setup

```bash
$ yarn install
```

## Environment variables

Create a `.env` file in the root directory of the project and add the following environment variables:

```bash
MONGO_DB_CONNECTION_STRING="add your connection string here"
JWT_SECRET="add your secret here"
```

Note: Update these values based on your environment.

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# unit test coverage
$ yarn run test:cov

# e2e tests
$ yarn run test:e2e

# e2e tests coverage
$ yarn run test:e2e:cov
```

## Folder Structure

```bash
sage-service/
├── src/
│   ├── application/       # Application layer for the API
│   |   ├── decorator/     # Custom decorators
│   |   ├── dtos/          # Data transfer objects
│   |   ├── guards/        # Guards for authentication and authorization
│   |   ├── middlewares/   # Middleware functions
│   |   ├── modules/       # Core modules for the graphql API
│   |   ├── mongoose/      # Mongoose schema and model definitions
│   |   ├── repositories/  # Data access layer
│   |   ├── resolvers/     # GraphQL resolvers
│   |   └── services/      # Service layer for business logic
│   ├── core/              # Core modules for the application
│   |   ├── @seedwork/     # Seedwork modules for DDD
│   |   ├── config/        # Configuration files
│   |   ├── contracts/     # Interfaces and types
│   |   ├── entities/      # Domain entities
│   |   ├── errors/        # Custom error classes
│   |   ├── helpers/       # Helper functions
│   |   ├── types/         # Types of entities and other data
│   |   ├── use-cases/     # Use cases for business logic
|   ├── schema.gql         # GraphQL schema
│   └── main.ts            # Application entry point
├── tests/                 # Test cases for the application
├── .env                   # Environment variables
├── jest.config.js         # Jest configuration
├── jest.e2e.js            # Jest end-to-end configuration
├── tsconfig.json          # TypeScript configuration
└── README.md
```

## API Documentation

The Sage Service GraphQL API consists of the following core modules:

```graphql
type Mutation {
  # Application
  createApplication(data: CreateApplicationInput!): CreateApplicationResponse!
  deleteApplication(id: String!): DefaultOperationResponse!
  updateApplication(data: UpdateApplicationInput!): UpdateApplicationResponse!

  # User
  createUser(data: CreateUserInput!): CreateUserResponse!
  updateUser(data: UpdateUserInput!): CreateUserResponse!
  deleteUser(id: String!): DefaultOperationResponse!

  # Auth
  login(email: String!, password: String!): TokenResponse!
  refreshToken(token: String!): TokenResponse!
}

type Query {
  # Application
  application(id: String!): Application!
  applications(pagination: DefaultPaginationInput!): FindApplicationsOutput!

  # User
  user(id: String!): User!
  users(pagination: DefaultPaginationInput!): UserPagination!
}
```

## Coverage
