import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import { render, RenderResult, waitFor } from "@testing-library/react";
import React from "react";
import { Login } from "../login";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      const mockedClient = createMockClient();
      renderResult = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mockedClient}>
              <Login />
              {/* ///state CHANGED >> useForm */}
            </ApolloProvider>
          </Router>
        </HelmetProvider>
      );
    });
  });

  it("should render ok", async () => {
    await waitFor(() => {
      expect(document.title).toBe("로그인 | Nuber Eats");
    });
  });

  it("displays email validation errors", async () => {
    const { getByPlaceholderText, getByText } = renderResult;
    const email = getByPlaceholderText("이메일");
    await waitFor(() => {
      //FIRE EVENT
      userEvent.type(email, "this@wont");
    });
    getByText("잘못된 이메일 형식입니다");
    await waitFor(() => {
      userEvent.clear(email);
    });
    getByText("이메일 주소를 인식할 수 없습니다");
  });

  it("display password required errors", async () => {
    //trigger form submit
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");
    const submitBtn = getByRole("button");
    await waitFor(() => {
      //FIRE EVENT
      userEvent.type(email, "this@will.work");
      userEvent.click(submitBtn);
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("패스워드를 인식할 수 없습니다");
  });
});
