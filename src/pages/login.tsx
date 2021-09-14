import { ApolloError, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/LoginMutation";

//mutation NAME_FOR_FRONTEND(APOLLO_VALIDATIONS)
//APOLLO_VALIDATIONS ($VARS:type)
//loginInput also from DTO!!
const LOGIN_MUTATION = gql`
  mutation LoginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  email: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginForm>();
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { error, ok, token },
    } = data;
    if (ok) {
      console.log(token);
    }
  };
  const onError = (error: ApolloError) => {};
  const [loginMutation, { data: loginMutationResult }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
    onError,
    //   variables:{
    //       loginInput:{
    //           email: watch("email"),
    //           password: watch('password')
    //       }
    //  }
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    loginMutation({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
        <h3 className="text-3xl text-gray-800">Login</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-3 mt-5 px-5"
        >
          <input
            {...register("email", { required: "Email is required" })}
            name="email"
            type="email"
            placeholder="email"
            className="input"
          />
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}

          <input
            {...register("password", {
              required: "Password is required",
              //   minLength: 10,
            })}
            name="password"
            type="password"
            placeholder="password"
            className="input"
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {errors.password?.type === "minLength" && (
            <FormError errorMessage="Password must be more than 10 chars." />
          )}
          <button className="btn">Log In</button>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
      </div>
    </div>
  );
};
