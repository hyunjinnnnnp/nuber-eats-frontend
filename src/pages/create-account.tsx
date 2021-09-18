import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { Helmet } from "react-helmet-async";
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
        <title>시작하기 | Nuber Eats</title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col px-5 items-center">
        <Logo styles="w-52 mb-7" />
        <Title title="시작하기" />
        <Subtitle subtitle="이메일 주소를 입력하세요(필수)" />
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <input
            {...register("email", {
              required: "이메일 주소를 인식할 수 없습니다",
              pattern: {
                value:
                  // eslint-disable-next-line
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "잘못된 이메일 형식입니다",
              },
            })}
            name="email"
            type="email"
            placeholder="이메일"
            className="input"
          />
          {formState.errors.email?.message && (
            <FormError errorMessage={formState.errors.email?.message} />
          )}

          <input
            {...register("password", {
              required: "패스워드를 인식할 수 없습니다",
              minLength: 10,
            })}
            required
            name="password"
            type="password"
            placeholder="비밀번호"
            className="input"
          />
          {formState.errors.password?.message && (
            <FormError errorMessage={formState.errors.password?.message} />
          )}
          {formState.errors.password?.type === "minLength" && (
            <FormError errorMessage="패스워드는 10자 이상이어야 합니다" />
          )}
          <select {...register("role", { required: true })} className="input">
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText={"계정 만들기"}
          />
          {createAccountMutationResult?.createAccount.error && (
            <FormError
              errorMessage={createAccountMutationResult.createAccount.error}
            />
          )}
        </form>
        <div>
          이미 가입한 계정이 있으신가요?
          <Link className="text-lime-600 hover:underline mx-2" to="/">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
};
