import { useQuery, gql } from "@apollo/client";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { Category } from "../../components/category";
import { Pagination } from "../../components/pagination";
import { Restaurant } from "../../components/restaurant";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
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
        ...CategoryParts
      }
    }
    restaurants(input: $input) {
      error
      ok
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
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

  interface IFormProps {
    searchTerm: string;
  }

  const onNextPageClick = () => setPage((current) => current + 1); //current : current state!!
  const onPrevPageClick = () => setPage((current) => current - 1);
  const { register, getValues, handleSubmit } = useForm<IFormProps>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `?term=${searchTerm}`, //VISIBLE URL
      //state: searchTerm, //sending data without putting it on the url
    });
  };
  return (
    <div>
      <Helmet>
        <title>홈 | Nuber Eats</title>
      </Helmet>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full h-52 flex items-center justify-center"
      >
        <input
          {...register("searchTerm", { required: true, min: 3 })}
          className="input w-3/4 md:w-3/12"
          type="search"
          placeholder="레스토랑 검색하기"
        />
      </form>
      {!loading && (
        <div className="container my-8 max-w-full">
          <div className="flex justify-center mx-auto md:px-72">
            {data?.allCategories.categories?.map((category) => (
              <Category
                categorySlug={category.slug}
                key={category.id}
                coverImg={category.coverImg ? category.coverImg : ""}
                categoryName={category.name}
              />
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-8 px-10">
            {data?.restaurants.results?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                id={restaurant.id + ""}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                address={restaurant.address}
                categoryName={restaurant.category?.name}
              />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={data?.restaurants.totalPages}
            onPrevPageClick={onPrevPageClick}
            onNextPageClick={onNextPageClick}
          />
        </div>
      )}
    </div>
  );
};
