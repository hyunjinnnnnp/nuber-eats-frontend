import { useApolloClient, useMutation, gql } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Title } from "../../components/title";
import { useMe } from "../../hooks/useMe";
import {
  editProfileMutation,
  editProfileMutationVariables,
} from "../../__generated__/editProfileMutation";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfileMutation($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;

interface IFormProps {
  email?: string;
  password?: string;
}

export const EditProfile = () => {
  const { data: userData } = useMe();
  const client = useApolloClient();
  const onCompleted = (data: editProfileMutation) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      const {
        me: { email: prevEmail, id },
      } = userData;
      const { email: newEmail } = getValues();
      if (prevEmail !== newEmail) {
        client.writeFragment({
          id: `User:${id}`,
          fragment: gql`
            fragment EditedUser on User {
              email
              verified
            }
          `,
          data: {
            email: newEmail,
            verified: false,
          },
        });
      }
    }
  };
  const [editProfile, { loading }] = useMutation<
    editProfileMutation,
    editProfileMutationVariables
  >(EDIT_PROFILE_MUTATION, { onCompleted });

  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };
  return (
    <div className="h-screen flex items-center flex-col mt-10 px-10 md:mt-24 md:px-32">
      <Helmet>
        <title>????????? ?????? | Nuber Eats</title>
      </Helmet>
      <Title title="Edit Profile" />
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <input
          {...register("email", {
            required: "????????? ????????? ????????? ??? ????????????",
            pattern: {
              value:
                // eslint-disable-next-line
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "????????? ????????? ???????????????",
            },
          })}
          className="input"
          type="email"
          placeholder="?????????"
        />
        <input
          {...register("password", {
            minLength: 10,
          })}
          className="input"
          type="password"
          placeholder="????????????"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="????????? ????????????"
        ></Button>
      </form>
    </div>
  );
};
