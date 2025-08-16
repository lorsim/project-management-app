import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from "@apollo/client";
import { client, setOrg } from "./apollo";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import ErrorToaster from "./ui/ErrorToaster"; 

setOrg(localStorage.getItem("org") || "acme");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <ErrorToaster /> 
      <Dashboard />
    </ApolloProvider>
  </StrictMode>
);
