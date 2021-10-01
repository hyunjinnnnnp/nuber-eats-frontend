import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";
import { useParams } from "react-router";
import {
  CATEGORY_FRAGMENT,
  DISH_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragments";
import {
  restaurantQuery,
  restaurantQueryVariables,
} from "../../__generated__/restaurantQuery";
import { Title } from "../../components/title";
import { Category } from "../../components/category";
import { Dish } from "../../components/dish";
import { CreateOrderItemInput } from "../../__generated__/globalTypes";
import { DishOption } from "../../components/dish-option";
import {
  createOrder,
  createOrderVariables,
} from "../../__generated__/createOrder";
import { useHistory } from "react-router-dom";

export const RESTAURANT_QUERY = gql`
  query restaurantQuery($input: RestaurantInput!) {
    restaurant(input: $input) {
      error
      ok
      restaurant {
        ...RestaurantParts
        category {
          ...CategoryParts
        }
        menu {
          ...DishParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  ${DISH_FRAGMENT}
`;

const CREATE_ORDER_MUTATION = gql`
  mutation createOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      error
      ok
      orderId
    }
  }
`;

interface IRestaurantParams {
  id: string;
}
export const Restaurant = () => {
  const params = useParams<IRestaurantParams>();
  const { data } = useQuery<restaurantQuery, restaurantQueryVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: +params.id,
        },
      },
    }
  );
  const [orderStarted, setOrderStarted] = useState(false);
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);

  const triggerStartOrder = () => {
    setOrderStarted(true);
  };
  const getItem = (dishId: number) => {
    return orderItems.find((order) => order.dishId === dishId);
  };
  const isSelected = (dishId: number) => {
    return Boolean(getItem(dishId));
  };
  const addItemToOrder = (dishId: number) => {
    if (isSelected(dishId)) {
      return;
    }
    setOrderItems((current) => [...current, { dishId, options: [] }]);
  };
  const removeFromOrder = (dishId: number) => {
    setOrderItems((current) =>
      current.filter((dish) => dish.dishId !== dishId)
    );
  };
  const addOptionToItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      const hasOption = Boolean(
        oldItem.options?.find((aOption) => aOption.name === optionName)
      );
      if (!hasOption) {
        removeFromOrder(dishId);
        setOrderItems((current) => [
          {
            dishId,
            options: [{ name: optionName }, ...oldItem.options!],
            //options should not include extra >> mutation does not want extra
          },
          ...current,
        ]);
      }
    }
  };
  const removeOptionFromItem = (dishId: number, optionName: string) => {
    if (!isSelected(dishId)) {
      return;
    }
    const oldItem = getItem(dishId);
    if (oldItem) {
      removeFromOrder(dishId);
      setOrderItems([
        {
          dishId,
          options: oldItem.options?.filter(
            (option) => option.name !== optionName
          ),
        },
      ]);
      return;
    }
  };
  const getOptionFromItem = (
    item: CreateOrderItemInput,
    optionName: string
  ) => {
    return item.options?.find((option) => option.name === optionName);
  };
  const isOptionSelected = (dishId: number, optionName: string) => {
    const item = getItem(dishId);
    if (item) {
      return Boolean(getOptionFromItem(item, optionName));
    }
    return false;
  };
  const triggerCancelOrder = () => {
    setOrderStarted(false);
    setOrderItems([]);
  };
  const history = useHistory();
  const onCompleted = (data: createOrder) => {
    const {
      createOrder: { orderId },
    } = data;
    if (data.createOrder.ok) {
      history.push(`/orders/${orderId}`);
    }
  };
  const [createOrderMutation, { loading: placingOrder }] = useMutation<
    createOrder,
    createOrderVariables
  >(CREATE_ORDER_MUTATION, { onCompleted });
  const triggerConfirmOrder = () => {
    if (placingOrder) {
      return;
    }
    if (orderItems.length === 0) {
      alert("Can't place empty order");
      return;
    }
    const ok = window.confirm("You are about to place an order");
    if (ok) {
      createOrderMutation({
        variables: {
          input: {
            restaurantId: +params.id,
            items: orderItems,
          },
        },
      });
    }
  };
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
      <div className="container mt-20 pb-32 flex flex-col items-end">
        {!orderStarted && (
          <button onClick={triggerStartOrder} className="btn px-10">
            Start Order
          </button>
        )}
        {orderStarted && (
          <div className="flex items-center">
            <button onClick={triggerConfirmOrder} className="btn px-10 mr-3">
              Confirm Order
            </button>
            <button
              onClick={triggerCancelOrder}
              className="btn px-10 bg-black hover:bg-black"
            >
              Cancel Order
            </button>
          </div>
        )}
        <div className="w-full grid mt-16 md:grid-cols-3 gap-x-5 gqp-y-10">
          {data?.restaurant.restaurant?.menu?.map((dish) => (
            <Dish
              isSelected={isSelected(dish.id)}
              id={dish.id}
              orderStarted={orderStarted}
              key={dish.id}
              name={dish.name}
              description={dish.description}
              price={dish.price}
              isCustomer={true}
              options={dish.options}
              addItemToOrder={addItemToOrder}
              removeFromOrder={removeFromOrder}
            >
              {dish.options?.map((option, index) => (
                <DishOption
                  key={index}
                  isSelected={isOptionSelected(dish.id, option.name)}
                  name={option.name}
                  extra={option.extra}
                  addOptionToItem={addOptionToItem}
                  dishId={dish.id}
                  removeOptionFromItem={removeOptionFromItem}
                />
              ))}
            </Dish>
          ))}
        </div>
      </div>
    </div>
  );
};
