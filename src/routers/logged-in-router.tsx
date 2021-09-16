import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NotFound } from "../pages/404";
import { Restaurants } from "../pages/client/restaurants";
import { meQuery } from "../__generated__/meQuery";

const ClientRoutes = [
  <Route path="/" exact>
    <Restaurants />
  </Route>,
];

const ME_QUERY = gql`
  query meQuery {
    me {
      id
      email
      role
      verified
    }
  }
`;

export const LoggedInRouter = () => {
  //without token >> error FORBIDDEN RESOURCE >> SET JWT TOKEN HEADERS apollo.ts
  const { data, loading, error } = useQuery<meQuery>(ME_QUERY);
  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    );
  }
  return (
    <Router>
      <Switch>
        {data.me.role === "Client" && ClientRoutes}
        {/* switch must have ROUTE! as CHILDRENT ELEM. not components nor fragments */}
        {/* <Redirect to="/" /> from EVERY WHERE */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
};
