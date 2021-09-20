import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";

import userEvent from "@testing-library/user-event";
import React from "react";
import { render, waitFor, RenderResult } from "../../test.utils";
import { Restaurants, RESTAURANTS_QUERY } from "../client/restaurants";
import { fireEvent } from "@testing-library/react";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

const mockedMutationResponse = jest.fn().mockResolvedValue({
  data: {
    allCategories: {
      //   __typename: "allCategoriesOutput",
      error: null,
      ok: true,
      categories: [
        {
          //   __typename: "Category",
          id: 1,
          name: "name",
          coverImg: "coverImg",
          slug: "slug",
          restaurantCount: 1,
        },
      ],
    },
    restaurants: {
      //   __typename: "restaurantsOutput",
      error: null,
      ok: true,
      totalPages: 1,
      totalResults: 1,
      results: [
        {
          //   __typename: "Restaurant",
          id: 1,
          name: "name",
          coverImg: "coverImg",
          category: {
            // __typename: "Category",
            name: "name",
          },
          address: "address",
          isPromoted: false,
        },
      ],
    },
  },
});

describe("<Restaurants />", () => {
  let mockClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockClient = createMockClient();
      mockClient.setRequestHandler(RESTAURANTS_QUERY, mockedMutationResponse);
      renderResult = render(
        <ApolloProvider client={mockClient}>
          <Restaurants />
        </ApolloProvider>
      );
    });
  });

  it("renders <Restaurants />", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Home | Nuber Eats");
    });
  });

  it("renders <Category />", async () => {
    await waitFor(() => {
      const { debug } = renderResult;
    });
  });

  //   it("push to /search?term=${searchTerm}", async () => {
  //     await waitFor(() => {
  //       mockPush({
  //         pathname: "/search",
  //         search: `?term=berger`,
  //       });
  //     });
  //     expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
  //     expect(mockPush).toHaveBeenCalled();
  //     expect(mockPush).toHaveBeenCalledWith({
  //       pathname: "/search",
  //       search: "?term=berger",
  //     });
  //   });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
