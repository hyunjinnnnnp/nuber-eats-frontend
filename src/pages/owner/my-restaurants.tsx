import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Title } from "../../components/title";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { myRestaurantsQuery } from "../../__generated__/myRestaurantsQuery";

const MY_RESTAURANTS_QUERY = gql`
  query myRestaurantsQuery {
    myRestaurants {
      error
      ok
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

export const MyRestaurants = () => {
  const { data } = useQuery<myRestaurantsQuery>(MY_RESTAURANTS_QUERY);
  console.log(data);
  return (
    <div className="container">
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      {data?.myRestaurants.ok &&
        data?.myRestaurants?.restaurants?.length === 0 && (
          <>
            <Title title="등록된 레스토랑이 없습니다" />
            <Link className="link" to="/add-restaurant">
              레스토랑 등록하기
            </Link>
          </>
        )}
    </div>
  );
};
