import { useApolloClient, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { useMe } from "../../hooks/useMe";
import {
  verifyEmailMutation,
  verifyEmailMutationVariables,
} from "../../__generated__/verifyEmailMutation";

const VERIFY_EMAIL_MUTAION = gql`
  mutation verifyEmailMutation($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const history = useHistory();
  const onCompleted = (data: verifyEmailMutation) => {
    //update the client cache value
    const {
      verifyEmail: { ok },
    } = data;
    if (ok && userData?.me.id) {
      //CACHING - reading and writing
      client.writeFragment({
        id: `User:${userData.me.id}`, //cache IDs have the format <_typename>:<id> BY DEFAULT
        fragment: gql`
          fragment VerifiedUser on User {
            # what we want to modify (a PART of the WHOLE MODEL)
            verified
          }
        `,
        data: {
          // sending data
          verified: true,
        },
      });
      history.push("/");
    }
  };
  const [verifyEmail] = useMutation<
    verifyEmailMutation,
    verifyEmailMutationVariables
  >(VERIFY_EMAIL_MUTAION, {
    onCompleted,
  });

  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    // OR   const location = useLocation().search;
    verifyEmail({
      variables: {
        input: { code },
      },
    });
  }, []);
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className="text-lg mb-1 font-medium">Confirmimg email...</h2>
      <h4 className="text-gray-700 text-sm">
        Please wait. Don't close this page
      </h4>
    </div>
  );
};