import { gql, useLazyQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useHistory, useLocation } from "react-router";
import { Pagination } from "../../components/pagination";
import { Restaurant } from "../../components/restaurant";
import { Title } from "../../components/title";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  searchRestaurantQuery,
  searchRestaurantQueryVariables,
} from "../../__generated__/searchRestaurantQuery";

const SEARCH_RESTAURANT = gql`
  query searchRestaurantQuery($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      error
      ok
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const Search = () => {
  const [page, setPage] = useState(1);
  const location = useLocation();
  const history = useHistory();
  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);
  //LAZY QUERY : Conditional Queries
  const [queryReadyToStart, { loading, data, called }] = useLazyQuery<
    searchRestaurantQuery,
    searchRestaurantQueryVariables
  >(SEARCH_RESTAURANT);
  const [searchTerm, setsearchTerm] = useState("");
  useEffect(() => {
    const [_, query] = location.search.split("?term=");
    if (!query) {
      return history.replace("/"); //replace : URL is not gonna show up on the history API (GO BACK)
    }
    //IF THERE IS A QUERY
    setsearchTerm(query);
    queryReadyToStart({
      variables: {
        input: {
          page,
          query,
        },
      },
    });
  }, [history, location, page]);
  return (
    <>
      <Helmet>
        <title>{searchTerm} | Nuber Eats</title>
      </Helmet>
      {!loading && (
        <div className="container">
          <Title title={`오늘은 ${searchTerm}를 먹어볼까`} />
          {data?.searchRestaurant.restaurants?.map((restaurant) => (
            <Restaurant
              key={restaurant.id}
              coverImg={restaurant.coverImg}
              name={restaurant.name}
              address={restaurant.address}
              categoryName={restaurant.category?.name}
              id={restaurant.id + ""}
            />
          ))}
          <Pagination
            page={page}
            totalPages={data?.searchRestaurant.totalPages}
            onPrevPageClick={onPrevPageClick}
            onNextPageClick={onNextPageClick}
          />
        </div>
      )}
    </>
  );
};
