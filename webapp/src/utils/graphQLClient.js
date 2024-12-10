import { ApolloClient, InMemoryCache } from '@apollo/client';
export const graphQLClient = new ApolloClient({
    uri: `${import.meta.env.VITE_SERVER_URL}/api`,
    cache: new InMemoryCache(),
});