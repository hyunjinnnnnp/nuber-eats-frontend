/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { OrderUpdateInput, OrderStatus } from "./globalTypes";

// ====================================================
// GraphQL subscription operation: orderUpdate
// ====================================================

export interface orderUpdate_orderUpdate_driver {
  __typename: "User";
  email: string;
}

export interface orderUpdate_orderUpdate_customer {
  __typename: "User";
  email: string;
}

export interface orderUpdate_orderUpdate_restaurant {
  __typename: "Restaurant";
  name: string;
}

export interface orderUpdate_orderUpdate {
  __typename: "Order";
  id: number;
  status: OrderStatus;
  total: number | null;
  driver: orderUpdate_orderUpdate_driver | null;
  customer: orderUpdate_orderUpdate_customer | null;
  restaurant: orderUpdate_orderUpdate_restaurant | null;
}

export interface orderUpdate {
  orderUpdate: orderUpdate_orderUpdate;
}

export interface orderUpdateVariables {
  input: OrderUpdateInput;
}
