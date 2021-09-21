import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory, useParams } from "react-router";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { Title } from "../../components/title";
import {
  createDish,
  createDishVariables,
} from "../../__generated__/createDish";
import { MY_RESTAURANT_QUERY } from "./my-restaurant";

const CREATE_DISH_MUTATION = gql`
  mutation createDish($input: CreateDishInput!) {
    createDish(input: $input) {
      error
      ok
    }
  }
`;

interface IPrams {
  restaurantId: string;
}

interface IForm {
  name: string;
  price: string;
  description: string;
  options: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<IPrams>();
  const history = useHistory();
  const { register, getValues, handleSubmit, formState } = useForm<IForm>({
    mode: "onChange",
  });
  const [createDishMutation, { data, loading }] = useMutation<
    createDish,
    createDishVariables
  >(CREATE_DISH_MUTATION, {
    //!! RESTAURANT_QUERY needs a variable for itself.
    refetchQueries: [
      {
        query: MY_RESTAURANT_QUERY,
        variables: {
          input: {
            id: +restaurantId,
          },
        },
      },
    ],
  });
  const onSubmit = () => {
    const { name, price, description } = getValues();
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
        },
      },
    });
    history.goBack();
  };

  return (
    <>
      <Helmet>
        <title>메뉴 등록 | Nuber Eats</title>
      </Helmet>
      <Title title="메뉴 등록하기" />
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("name", {
            required: "메뉴 이름을 입력해주세요(필수)",
            minLength: {
              value: 5,
              message: "메뉴 이름은 5글자 이상이어야 합니다",
            },
          })}
          type="text"
          placeholder="메뉴 이름"
          className="input"
        />
        {formState.errors.name?.message && (
          <FormError errorMessage={formState.errors.name?.message} />
        )}
        <input
          {...register("price", {
            required: "메뉴 가격을 입력해주세요(필수)",
          })}
          type="number"
          placeholder="메뉴 가격"
          min={0}
          className="input"
        />
        <input
          {...register("description", {
            required: "메뉴 상세를 입력해주세요(필수)",
          })}
          type="text"
          placeholder="메뉴 상세"
          className="input"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="메뉴 등록하기"
        />
      </form>
    </>
  );
};
