import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  from,
} from "@apollo/client";

const baseUri = import.meta.env.VITE_API_URL ?? "http://localhost:8000/graphql";
let currentOrg = localStorage.getItem("org") || "acme";
export const setOrg = (slug: string) => {
  currentOrg = slug;
  localStorage.setItem("org", slug);
};

const orgLink = new ApolloLink((operation, forward) => {
  const ctx = operation.getContext();
  const uri = new URL((ctx.uri ?? baseUri) as string);
  uri.searchParams.set("org", currentOrg);
  operation.setContext({ uri: uri.toString() });
  return forward(operation);
});

const httpLink = createHttpLink({ uri: baseUri });

export const client = new ApolloClient({
  link: from([orgLink, httpLink]),
  cache: new InMemoryCache(),
});
