import React, { useEffect } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import {
  DISH_FRAGMENT,
  FULL_ORDER_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragments";
import { useQuery, useSubscription, gql } from "@apollo/client";
import { Dish } from "../../components/dish";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryTheme,
  VictoryVoronoiContainer,
} from "victory";
import {
  myRestaurant,
  myRestaurantVariables,
} from "../../__generated__/myRestaurant";
import { pendingOrders } from "../../__generated__/pendingOrders";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      error
      ok
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders {
    pendingOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IParams>();
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(
    MY_RESTAURANT_QUERY,
    {
      variables: {
        input: {
          id: +id,
        },
      },
    }
  );

  const { data: subscriptionData } = useSubscription<pendingOrders>(
    PENDING_ORDERS_SUBSCRIPTION
  );
  const history = useHistory();
  useEffect(() => {
    if (subscriptionData?.pendingOrders.id) {
      history.push(`/orders/${subscriptionData.pendingOrders.id}`);
    }
  }, [subscriptionData, history]);
  return (
    <div>
      <div
        className="  bg-gray-700  py-28 bg-center bg-cover"
        style={{
          backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link
          to={`/restaurant/${id}/add-dish`}
          className=" mr-8 text-white bg-gray-800 py-3 px-10"
        >
          Add Dish &rarr;
        </Link>
        <Link to={``} className=" text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-5">메뉴를 등록해주세요</h4>
          ) : (
            <div className="grid mt-16 md:grid-cols-3 gap-x-5 gqp-y-10">
              {data?.myRestaurant.restaurant?.menu.map((dish) => (
                <Dish
                  key={dish.id}
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
          <h4 className="text-center text-2xlg font-medium">Sales</h4>
          <div className=""></div>
          <VictoryChart
            theme={VictoryTheme.material}
            width={window.innerWidth}
            height={500}
            domainPadding={50}
            containerComponent={<VictoryVoronoiContainer />}
          >
            <VictoryLine
              labels={({ datum }) => `$${datum.y}`}
              labelComponent={
                <VictoryLabel
                  style={{ fontSize: 14 }}
                  renderInPortal
                  dy={-20}
                />
              }
              data={data?.myRestaurant.restaurant?.orders.map(
                (order: { createdAt: any; total: any }) => ({
                  x: order.createdAt,
                  y: order.total,
                })
              )}
              interpolation="natural"
              style={{
                data: {
                  strokeWidth: 5,
                },
              }}
            />
            <VictoryAxis
              style={{ tickLabels: { fontSize: 16 } }}
              tickFormat={(tick) => new Date(tick).toLocaleDateString()}
            />
          </VictoryChart>
        </div>
      </div>
    </div>
  );
};
