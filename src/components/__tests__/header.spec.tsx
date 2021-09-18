import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { Header } from "../header";
import { ME_QUERY } from "../../hooks/useMe";

describe("<Header />", () => {
  it("renders verify banner", async () => {
    await waitFor(async () => {
      //we changing the state,>> triggering rerender
      const { getByText } = render(
        <MockedProvider
          mocks={[
            //mocking the RESULTS
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "",
                    role: "",
                    verified: false,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      //waiting for query
      await new Promise((resolve) => setTimeout(resolve, 0));
      getByText("Please verify your email");
    });
  });

  it("renders without verify banner", async () => {
    await waitFor(async () => {
      //we changing the state,>> triggering rerender
      const { queryByText } = render(
        <MockedProvider
          mocks={[
            //mocking the RESULTS
            {
              request: {
                query: ME_QUERY,
              },
              result: {
                data: {
                  me: {
                    id: 1,
                    email: "",
                    role: "",
                    verified: true,
                  },
                },
              },
            },
          ]}
        >
          <Router>
            <Header />
          </Router>
        </MockedProvider>
      );
      //waiting for query
      await new Promise((resolve) => setTimeout(resolve, 0));
      expect(queryByText("Please verify your email")).toBeNull;
      //checking the text is not there : RETURNS null || elem
    });
  });
});
