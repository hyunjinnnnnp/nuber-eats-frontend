import { useApolloClient, useMutation, gql } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Button } from "../../components/button";
import { FormError } from "../../components/form-error";
import { Subtitle } from "../../components/subtitle";
import { Title } from "../../components/title";
import {
  CreateRestaurant,
  CreateRestaurantVariables,
} from "../../__generated__/CreateRestaurant";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";

const CREATE_RESTAURANT = gql`
  mutation CreateRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

interface IFormProps {
  name: string;
  address: string;
  categoryName: string;
  file: FileList;
}

export const AddRestaurant = () => {
  const client = useApolloClient();
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState("");
  const onCompleted = (data: CreateRestaurant) => {
    const {
      createRestaurant: { ok, restaurantId },
    } = data;
    if (ok) {
      const { name, categoryName, address } = getValues();
      setUploading(false);
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY });
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            //add query : new restaurant object
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: "Category",
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult.myRestaurants.restaurants, //returning the prev data
            ],
          },
        },
      });
      history.push("/");
    }
  };
  const [CreateRestaurantMutation, { data }] = useMutation<
    CreateRestaurant,
    CreateRestaurantVariables
  >(CREATE_RESTAURANT, {
    onCompleted,
    refetchQueries: [{ query: MY_RESTAURANTS_QUERY }],
  });
  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode: "onChange",
  });
  const [uploading, setUploading] = useState(false);
  const onSubmit = async () => {
    try {
      setUploading(true);
      const { file, name, categoryName, address } = getValues();
      const actualFile = file[0];
      const formBody = new FormData();
      formBody.append("file", actualFile);
      const { url: coverImg } = await (
        await fetch("http://localhost:4000/uploads/", {
          method: "POST",
          body: formBody,
        })
      ).json();
      setImageUrl(coverImg);
      CreateRestaurantMutation({
        variables: {
          input: {
            name,
            categoryName,
            address,
            coverImg,
          },
        },
      });
    } catch (e) {}
  };
  return (
    <>
      <Helmet>
        <title>???????????? ???????????? | Nuber Eats</title>
      </Helmet>
      <Title title="??????????????? ??????????????????????" />
      <Subtitle subtitle="???????????? ????????????" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="input"
          {...register("name", {
            required: "???????????? ????????? ???????????????(??????)",
          })}
          type="text"
          placeholder="???????????? ??????"
        />
        <input
          className="input"
          {...register("address", {
            required: "???????????? ????????? ???????????????(??????)",
          })}
          type="text"
          placeholder="???????????? ??????"
        />
        <input
          className="input"
          {...register("categoryName", {
            required: "???????????? ????????? ???????????????(??????)",
          })}
          type="text"
          placeholder="????????????"
        />
        <div>
          <input
            type="file"
            {...register("file", { required: true })}
            accept="image/*"
          />
        </div>
        <Button
          loading={uploading}
          canClick={formState.isValid}
          actionText="????????????"
        />
        {data?.createRestaurant?.error && (
          <FormError errorMessage={data.createRestaurant.error} />
        )}
      </form>
    </>
  );
};
