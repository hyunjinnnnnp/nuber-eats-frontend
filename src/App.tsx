import { useQuery, useReactiveVar } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { isLoggedInVar } from "./apollo";
import { LoggedInRouter } from "./routers/logged-in-router";
import { LoggedOutRouter } from "./routers/logged-out-router";

function App() {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />;
}

export default App;
