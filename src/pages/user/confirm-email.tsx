import { useApolloClient, useMutation, gql } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory } from "react-router";
import { Subtitle } from "../../components/subtitle";
import { Title } from "../../components/title";
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
      //OR  await refetch(); //refetch the useMe Query >>Get the current data from backend
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
    verifyEmail({
      variables: {
        input: { code },
      },
    });
  }, [verifyEmail]);
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <Helmet>
        <title>Verify Email | Nuber Eats</title>
      </Helmet>
      <Title title="Confirming email..." />
      <Subtitle subtitle="Please wait. Don't close this page" />
    </div>
  );
};
