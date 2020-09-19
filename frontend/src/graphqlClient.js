import { GraphQLClient } from 'graphql-request';

const endpoint = 'http://localhost:8000/graphql';

export const client = new GraphQLClient(endpoint, { headers: {} });
