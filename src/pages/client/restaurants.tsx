import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Category } from "../../components/category";
import { Restaurant } from "../../components/restaurant";
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
  const [page, setPage] = useState(1);
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });
  const onNextPageClick = () => setPage((current) => current + 1); //current : current state!!
  const onPrevPageClick = () => setPage((current) => current - 1);
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
              <Category
                coverImg={category.coverImg ? category.coverImg : ""}
                categoryName={category.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-x-5 gap-y-10 mt-8 px-10">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                address={restaurant.address}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <div className="grid grid-cols-3 text-center items-center max-w-xs mx-auto mt-10">
            {page > 1 ? (
              <button
                onClick={onPrevPageClick}
                className="focus:outline-none text-lg font-bold"
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span className="mx-5">
              {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                onClick={onNextPageClick}
                className="focus:outline-none text-lg font-bold"
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
