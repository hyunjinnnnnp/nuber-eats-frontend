import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { Subtitle } from "../../components/subtitle";
import { Title } from "../../components/title";
import {
  CreateRestaurant,
  CreateRestaurantVariables,
} from "../../__generated__/CreateRestaurant";

const CREATE_RESTAURANT = gql`
  mutation CreateRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
}

export const AddRestaurant = () => {
  const [CreateRestaurantMutation, { data, loading }] = useMutation<
    CreateRestaurant,
    CreateRestaurantVariables
  >(CREATE_RESTAURANT);
  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode: "onChange",
  });
  const onSubmit = () => {
    console.log(getValues());
  };
  return (
    <>
      <Helmet>
        <title>레스토랑 등록하기 | Nuber Eats</title>
      </Helmet>
      <Title title="레스토랑을 운영중이신가요?" />
      <Subtitle subtitle="레스토랑 등록하기" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input"
          {...register("name", {
            required: "레스토랑 이름을 입력하세요(필수)",
          })}
          type="text"
          placeholder="레스토랑 이름"
        />
        <input
          className="input"
          {...register("address", {
            required: "레스토랑 주소를 입력하세요(필수)",
          })}
          type="text"
          //   name="address"
          placeholder="레스토랑 주소"
        />
        <input
          className="input"
          {...register("categoryName", {
            required: "레스토랑 주소를 입력하세요(필수)",
          })}
          type="text"
          //   name="categoryName"
          placeholder="카테고리"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="등록하기"
        />
      </form>
    </>
  );
};
