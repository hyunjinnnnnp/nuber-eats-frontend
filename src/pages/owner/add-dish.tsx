import { useMutation, gql } from "@apollo/client";
import React, { useState } from "react";
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
  [key: string]: string;
}

export const AddDish = () => {
  const { restaurantId } = useParams<IPrams>();
  const history = useHistory();
  const { register, getValues, handleSubmit, formState, setValue } =
    useForm<IForm>({
      mode: "onChange",
    });
  const [createDishMutation, { loading }] = useMutation<
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
    const { name, price, description, ...rest } = getValues();
    const optionObjects = optionsNumber.map((theId) => ({
      name: rest[`${theId}-optionName`],
      extra: +rest[`${theId}-optionExtra`],
    }));
    createDishMutation({
      variables: {
        input: {
          name,
          price: +price,
          description,
          restaurantId: +restaurantId,
          options: optionObjects,
        },
      },
    });
    history.goBack();
  };
  const [optionsNumber, setOptionsNumber] = useState<number[]>([]);
  const onAddOptionClick = () => {
    setOptionsNumber((current) => [Date.now(), ...current]);
  };
  const onClickDelete = (idToDelete: number) => {
    setOptionsNumber((current) => current.filter((id) => id !== idToDelete));
    setValue(`${idToDelete}-optionName`, "");
    setValue(`${idToDelete}-optionExtra`, "");
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
        <div>
          <h4 className="font-medium mb-3 text-lg">메뉴 옵션</h4>
          <span
            onClick={onAddOptionClick}
            className="cursor-pointer text-white bg-gray-900 py-1 px-2 mt-5"
          >
            옵션 추가하기
          </span>
          {optionsNumber.length !== 0 &&
            optionsNumber.map((id) => (
              <div key={id} className="mt-5">
                <input
                  {...register(`${id}-optionName`)}
                  className="py-2 px-4 mr-3 focus:outline-none focus:border-gray-600 border-2"
                  type="text"
                  placeholder="옵션 내용"
                />
                <input
                  {...register(`${id}-optionExtra`)}
                  className="py-2 px-4 focus:outline-none focus:border-gray-600 border-2"
                  type="number"
                  min={0}
                  placeholder="추가요금"
                />
                <span
                  className="py-3 px-4 cursor-pointer text-white bg-red-500 ml-3 mt-5"
                  onClick={() => onClickDelete(id)}
                >
                  삭제
                </span>
              </div>
            ))}
        </div>
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="메뉴 등록하기"
        />
      </form>
    </>
  );
};
