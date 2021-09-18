import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { render, RenderResult, waitFor } from "@testing-library/react";
import React from "react";
import { Login, LOGIN_MUTATION } from "../login";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
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

  it("display password length errors", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");
    const password = getByPlaceholderText("비밀번호");
    const submitBtn = getByRole("button");
    await waitFor(() => {
      userEvent.type(email, "this@will.work");
      userEvent.type(password, "12");
      userEvent.click(submitBtn);
    });
    const errorMessage = getByRole("alert");
    expect(errorMessage).toHaveTextContent("패스워드는 10자 이상이어야 합니다");
  });

  it("submits form ans calls mutation", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");
    const password = getByPlaceholderText("비밀번호");
    const submitBtn = getByRole("button");
    const formData = {
      email: "real@test.com",
      password: "1212121212",
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "xx",
          error: null,
        },
      },
    });
    //sending REAL mutation and intercept the response
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: {
        ...formData,
      },
    });
  });
});
