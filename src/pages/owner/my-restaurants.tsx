import { useQuery, gql } from "@apollo/client";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";
import { Title } from "../../components/title";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { myRestaurantsQuery } from "../../__generated__/myRestaurantsQuery";

export const MY_RESTAURANTS_QUERY = gql`
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
  return (
    <div className="container">
      <Helmet>
        <title>My Restaurants | Nuber Eats</title>
      </Helmet>
      {data?.myRestaurants.ok &&
      data?.myRestaurants?.restaurants?.length === 0 ? (
        <>
          <Title title="등록된 레스토랑이 없습니다" />
          <Link className="link" to="/add-restaurant">
            레스토랑 등록하기
          </Link>
        </>
      ) : (
        <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-8 px-10">
          {data?.myRestaurants?.restaurants?.map((restaurant) => (
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
      )}
    </div>
  );
};
