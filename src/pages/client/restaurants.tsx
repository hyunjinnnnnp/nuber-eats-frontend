import { gql, useQuery } from "@apollo/client";
import React from "react";
import {
  restaurantsPageQuery,
  restaurantsPageQueryVariables,
} from "../../__generated__/restaurantsPageQuery";

export const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!) {
    allCategories {
      error
      ok
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input: $input) {
      error
      ok
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

export const Restaurants = () => {
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page: 1,
      },
    },
  });
  return (
    <div>
      <form className="bg-gray-800 w-full h-52 flex items-center justify-center">
        <input
          className="input w-3/12"
          type="Search"
          placeholder="레스토랑 검색하기"
        />
      </form>
      {!loading && (
        <div className="container my-8 max-w-full">
          <div className="flex justify-center mx-auto md:px-72">
            {data?.allCategories.categories?.map((category) => (
              <div className="flex flex-col justify-center items-center mx-auto group cursor-pointer">
                <div
                  className="w-14 h-14 mx-3 rounded-full bg-cover shadow-sm group-hover:shadow-md group-hover:bg-gray-100"
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                ></div>
                <span className="text-sm font-semibold mt-2 text-center">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-10 mt-16 px-10">
            {data?.restaurants.results?.map((restaurant) => (
              <div>
                <div
                  className="py-10 bg-cover bg-center mb-2"
                  style={{ backgroundImage: `url(${restaurant.coverImg})` }}
                ></div>
                <h3 className="text-lg font-medium">{restaurant.name}</h3>
                <span className="text-sm font-thin">
                  {restaurant.category?.name}
                </span>
                <span className="text-sm font-thin">{restaurant.address}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
