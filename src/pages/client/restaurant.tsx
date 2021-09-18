import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  restaurantQuery,
  restaurantQueryVariables,
} from "../../__generated__/restaurantQuery";
import { Title } from "../../components/title";
import { Category } from "../../components/category";

const RESTAURANT_QUERY = gql`
  query restaurantQuery($input: RestaurantInput!) {
    restaurant(input: $input) {
      error
      ok
      restaurant {
        ...RestaurantParts
        category {
          ...CategoryParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface IRestaurantParams {
  id: string;
}

export const Restaurant = () => {
  const { id } = useParams<IRestaurantParams>();
  const { loading, data } = useQuery<restaurantQuery, restaurantQueryVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +id,
        },
      },
    }
  );
  console.log(data?.restaurant.restaurant?.category);

  return (
    <div>
      <div
        className="py-44 bg-center bg-cover bg-gray-800 h-80 relative"
        style={{
          backgroundImage: `url(${data?.restaurant.restaurant?.coverImg})`,
        }}
      >
        <div className="bg-white bg-opacity-90 w-2/6 h-40 shadow-sm py-4">
          <Title
            title={`${data?.restaurant.restaurant?.name}`}
            className="px-4"
          />
          <h4 className="pl-4 text-sm font-thin">{`${data?.restaurant.restaurant?.address}`}</h4>
          <Category
            className="absolute right-4"
            coverImg={data?.restaurant.restaurant?.category?.coverImg || ""}
            categorySlug={data?.restaurant.restaurant?.category?.slug || ""}
          />
        </div>
      </div>
    </div>
  );
};
