import { MockedProvider } from "@apollo/client/testing";
import React from "react";
import { render, waitFor } from "../../test.utils";
import { Restaurant, RESTAURANT_QUERY } from "../client/restaurant";
const mocks = [
  {
    request: {
      query: RESTAURANT_QUERY,
      variables: {
        input: {
          restaurantId: 1,
        },
      },
    },
    result: {
      data: {
        restaurant: {
          __typename: "RestaurantOutput",
          error: "",
          ok: true,
          restaurant: {
            __typename: "Restaurant",
            id: 1,
            name: "name",
            coverImg: "coverImg",
            category: {
              __typename: "Category",
              name: "name",
              id: 1,
              coverImg: "coverImg",
              slug: "slug",
              restaurantCount: 1,
            },
            address: "address",
            isPromoted: true,
          },
        },
      },
    },
  },
];

describe("<Restaurant />", () => {
  it("renders restaurant", async () => {
    await waitFor(async () => {
      render(
        <MockedProvider mocks={mocks}>
          <Restaurant />
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
});
