import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router";
import { FULL_ORDER_FRAGMENT } from "../fragments";
import { useMe } from "../hooks/useMe";
import { getOrder, getOrderVariables } from "../__generated__/getOrder";
import {
  orderUpdate,
  orderUpdateVariables,
} from "../__generated__/orderUpdate";

const GET_ORDER_QUERY = gql`
  query getOrder($input: GetOrderInput!) {
    getOrder(input: $input) {
      error
      ok
      order {
        ...FullOrderParts
      }
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const ORDER_SUBSCRIPTION = gql`
  subscription orderUpdate($input: OrderUpdateInput!) {
    orderUpdate(input: $input) {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface IParams {
  id: string;
}
export const Order = () => {
  const params = useParams<IParams>();
  const { data: userData } = useMe();
  const { data, subscribeToMore } = useQuery<getOrder, getOrderVariables>(
    GET_ORDER_QUERY,
    {
      variables: {
        input: {
          id: +params.id,
        },
      },
    }
  );
  // INSTEAD OF MAKING SUBSCRIPTION HOOK, SUBSCRIBE TO MORE. updating data
  useEffect(() => {
    if (data?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_SUBSCRIPTION,
        variables: {
          input: {
            id: +params.id,
          },
        },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: orderUpdate } } //for TS
        ) => {
          if (!data) return prev;
          return {
            //return data with the same structure
            getOrder: {
              ...prev.getOrder,
              order: {
                //override with the new order
                ...data.orderUpdate,
              },
            },
          };
        },
      });
    }
  }, [data, params.id, subscribeToMore]);

  return (
    <div className="mt-32 container flex justify-center">
      <Helmet>
        <title>Order #{params.id} | Nuber Eats</title>
      </Helmet>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <h4 className="bg-gray-800 w-full py-5 text-white text-center text-xl">
          Order #{params.id}
        </h4>
        <h5 className="p-5 pt-10 text-3xl text-center ">
          ${data?.getOrder.order?.total}
        </h5>
        <div className="p-5 text-xl grid gap-6">
          <div className="border-t pt-5 border-gray-700">
            Prepared By:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t pt-5 border-gray-700 ">
            Deliver To:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.customer?.email}
            </span>
          </div>
          <div className="border-t border-b py-5 border-gray-700">
            Driver:{" "}
            <span className="font-medium">
              {data?.getOrder.order?.driver?.email || "Not yet."}
            </span>
          </div>
          {userData?.me.role === "Client" && (
            <span className=" text-center mt-5 mb-3  text-2xl text-lime-600">
              Status: {data?.getOrder.order?.status}
            </span>
          )}
          {userData?.me.role === "Owner" && (
            <>
              {data?.getOrder.order?.status === "Pending" && (
                <button className="btn">Accept Order</button>
              )}
              {data?.getOrder.order?.status === "Cooking" && (
                <button className="btn">Order Cooked</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
