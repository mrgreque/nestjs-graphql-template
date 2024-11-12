import { gql } from 'apollo-server-core';
import { print } from 'graphql';

export namespace GenerateGql {
  export type Input = {
    operator: string;
    operation: string;
    responseFields: string[];
    variables: Record<string, string>;
  };

  export type Output = {
    query: string;
  };
}

export function generateGql(props: GenerateGql.Input): GenerateGql.Output {
  const { operator, operation, responseFields, variables } = props;

  const variablesString = Object.entries(variables).map(([key, value]) => {
    return `${key}: ${value}`;
  });

  const responseFieldsString = responseFields.join('\n');

  return {
    query: print(gql`
    ${operator} {
      ${operation}(${variablesString.join(', ')}) {
        ${responseFieldsString}
      }
    }
  `),
  };
}
