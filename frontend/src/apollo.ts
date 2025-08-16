import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL ?? "http://localhost:8000/graphql",
});

let currentOrg = localStorage.getItem("org") || "acme";
export const setOrg = (slug: string) => {
  currentOrg = slug;
  localStorage.setItem("org", slug);
};

const orgLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: { ...headers, "X-Org-Slug": currentOrg },
  }));
  return forward(operation);
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  const msgs: string[] = [];

  if (graphQLErrors?.length) {
    for (const e of graphQLErrors) msgs.push(e.message);
  }

  if (networkError) {
    if (networkError instanceof Error) {
      msgs.push(networkError.message);
    } else {
      // Covers ServerError/ClientError or unexpected shapes
      msgs.push(String(networkError));
    }
  }

  if (msgs.length) {
    window.dispatchEvent(
      new CustomEvent<string>("app-error", { detail: msgs.join(" · ") })
    );
  }
});

export const client = new ApolloClient({
  link: from([errorLink, orgLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Project: { keyFields: ["id"] },
      Task: { keyFields: ["id"] },
    },
  }),
});
