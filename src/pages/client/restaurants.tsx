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
        <div className="container my-8 max-w-full md:px-72">
          <div className="flex justify-center mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <div className="flex flex-col justify-center items-center mx-auto">
                <div
                  className="w-14 h-14 mx-3 rounded-full bg-cover shadow-sm hover:shadow-md hover:bg-gray-100 cursor-pointer"
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                ></div>
                <span className="text-sm font-semibold mt-2 text-center">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
