import { useMutation, gql } from "@apollo/client";
import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "../components/button";
import { FormError } from "../components/form-error";
import {
  createAccountMutation,
  createAccountMutationVariables,
} from "../__generated__/createAccountMutation";
import { UserRole } from "../__generated__/globalTypes";
import { Logo } from "../components/logo";
import { Title } from "../components/title";
import { Subtitle } from "../components/subtitle";
import { Helmet } from "react-helmet-async";

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

interface ICreateAccountInput {
  email: string;
  password: string;
  role: UserRole; //from DTO !!!
}

export const CreateAccount = () => {
  const { register, getValues, handleSubmit, formState } =
    useForm<ICreateAccountInput>({
      mode: "onChange", //for formState.isValid
      defaultValues: {
        role: UserRole.Client,
      },
    });
  const history = useHistory();
  const onCompleted = (data: createAccountMutation) => {
    const {
      createAccount: { ok },
    } = data;
    if (ok) {
      //TO DO: Log in and push to "/"
      alert("Account Created! Log in now!");
      //redirect
      history.push("/");
    }
  };
  const [
    createAccountMutation,
    { data: createAccountMutationResult, loading },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );

  const onSubmit = () => {
    if (!loading) {
      const { email, password, role } = getValues();
      createAccountMutation({
        variables: {
          createAccountInput: {
            email,
            password,
            role,
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
        <title>404 | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <Logo styles="w-52 mb-7" />
        <Title title="????????????" />
        <Subtitle subtitle="????????? ????????? ???????????????(??????)" />
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
          <select {...register("role", { required: true })} className="input">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={"?????? ?????????"}
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          ?????? ????????? ????????? ????????????????
          <Link className="link" to="/">
            ???????????????
          </Link>
        </div>
      </div>
    </div>
  );
};
