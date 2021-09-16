import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { isLoggedInVar } from "../apollo";
import { meQuery } from "../__generated__/meQuery";

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
    <div>
      <h1>{data.me.role}</h1>
    </div>
  );
};
