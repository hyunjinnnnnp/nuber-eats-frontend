import React from "react";
import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { MemoryRouter, Route } from "react-router-dom";
import { Category, CATEGORY_QUERY } from "../client/category";
import { Restaurant } from "../../components/restaurant";

const mockData = {
  page: 1,
  slug: "burger",
};

describe("<Category />", () => {
  it("renders OK", async () => {
    await waitFor(async () => {
      const { debug } = render(
        <MockedProvider
          mocks={[
            {
              request: {
                query: CATEGORY_QUERY,
                variables: {
                  input: {
                    ...mockData,
                  },
                },
              },
              result: {
                data: {
                  category: {
                    __typename: "categoryOutput",
                    ok: true,
                    error: null,
                    totalPages: 1,
                    totalResults: 1,
                    category: {
                      __typename: "Category",
                      id: 1,
                      name: "burger",
                      coverImg: "coverImg",
                      slug: mockData.slug,
                      restaurantCount: 1,
                    },
                    restaurants: [
                      {
                        __typename: "Restaurant",
                        id: 1,
                        name: "name",
                        coverImg: "coverImg",
                        category: {
                          __typename: "Category",
                          name: mockData.slug,
                        },
                        address: "address",
                        isPromoted: false,
                      },
                    ],
                  },
                },
              },
            },
          ]}
        >
          <HelmetProvider>
            <MemoryRouter initialEntries={["/"]}>
              <Route path={`/category/${mockData.slug}`}>
                <Category />
              </Route>
            </MemoryRouter>
          </HelmetProvider>
        </MockedProvider>
      );
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });

  // it("should renders <Restaurant />", async () => {
  //   await waitFor(async () => {
  //     const { debug } = render(
  //       <MockedProvider
  //         mocks={[
  //           {
  //             request: {
  //               query: CATEGORY_QUERY,
  //               variables: {
  //                 input: {
  //                   ...mockData,
  //                 },
  //               },
  //             },
  //             result: {
  //               data: {
  //                 category: {
  //                   __typename: "categoryOutput",
  //                   ok: true,
  //                   error: null,
  //                   totalPages: 1,
  //                   totalResults: 1,
  //                   category: {
  //                     __typename: "Category",
  //                     id: 1,
  //                     name: "burger",
  //                     coverImg: "coverImg",
  //                     slug: mockData.slug,
  //                     restaurantCount: 1,
  //                   },
  //                   restaurants: [
  //                     {
  //                       __typename: "Restaurant",
  //                       id: 1,
  //                       name: "name",
  //                       coverImg: "coverImg",
  //                       category: {
  //                         __typename: "Category",
  //                         name: mockData.slug,
  //                       },
  //                       address: "address",
  //                       isPromoted: false,
  //                     },
  //                   ],
  //                 },
  //               },
  //             },
  //           },
  //         ]}
  //       >
  //         <HelmetProvider>
  //           <MemoryRouter initialEntries={["/"]}>
  //             <Route path={`/category/${mockData.slug}`}>
  //               {/* <Category> */}
  //               <Restaurant
  //                 id="1"
  //                 name="name"
  //                 coverImg="coverImg"
  //                 categoryName="category"
  //                 address="address"
  //               />
  //               {/* </Category> */}
  //             </Route>
  //           </MemoryRouter>
  //         </HelmetProvider>
  //       </MockedProvider>
  //     );
  //     await new Promise((resolve) => setTimeout(resolve, 0));
  //     // debug();
  //   });
  // });
});
