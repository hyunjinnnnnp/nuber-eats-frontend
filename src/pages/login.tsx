import { useMutation, gql } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { authToken, isLoggedInVar } from "../apollo";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import { Logo } from "../components/logo";
import { Subtitle } from "../components/subtitle";
import { Title } from "../components/title";
import { LOCALSTORAGE_TOKEN } from "../constants";
import {
  LoginMutation,
  LoginMutationVariables,
} from "../__generated__/LoginMutation";

//mutation NAME_FOR_FRONTEND(APOLLO_VALIDATIONS)
//APOLLO_VALIDATIONS ($VARS:type)
//loginInput also from DTO!!
export const LOGIN_MUTATION = gql`
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
  resultError?: string;
}

export const Login = () => {
  const { register, getValues, handleSubmit, formState } = useForm<ILoginForm>({
    mode: "onChange", //for formState.isValid
  });
  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authToken(token); //saving the token (Reactive Variables)
      isLoggedInVar(true);
    }
  };
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
  });

  const onSubmit = () => {
    if (!loading) {
      const { email, password } = getValues();
      loginMutation({
        variables: {
          loginInput: {
            email,
            password,
          },
        },
      });
    }
  };
  return (
    <div className="h-screen flex items-center flex-col mt-10 md:mt-24">
      {/* lg: for responsive design. large ? mt-28, : default mt-10
        mobile first  */}
      <Helmet>
        <title>????????? | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <Logo styles="w-52 mb-7" />
        <Title title="???????????? ?????? ???????????????" />
        <Subtitle subtitle="????????? ????????? ??????????????????" />
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
            name="email"
            type="email"
            placeholder="?????????"
            className="input"
          />
          {formState.errors.email?.message && (
            <FormError errorMessage={formState.errors.email?.message} />
          )}
          <input
            {...register("password", {
              required: "??????????????? ????????? ??? ????????????",
              minLength: 10,
            })}
            required
            name="password"
            type="password"
            placeholder="????????????"
            className="input"
          />
          {formState.errors.password?.message && (
            <FormError errorMessage={formState.errors.password?.message} />
          )}
          {formState.errors.password?.type === "minLength" && (
            <FormError errorMessage="??????????????? 10??? ??????????????? ?????????" />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={"?????????"}
          />
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </form>
        <div>
          Uber??? ???????????????????{" "}
          <Link className=" text-lime-600 hover:underline" to="/create-account">
            ?????? ?????????
          </Link>
        </div>
      </div>
    </div>
  );
};
