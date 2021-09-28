/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateOrderInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createOrder
// ====================================================

export interface createOrder_createOrder {
  __typename: "CreateOrderOutput";
  error: string | null;
  ok: boolean;
}

export interface createOrder {
  createOrder: createOrder_createOrder;
}

export interface createOrderVariables {
  input: CreateOrderInput;
}
