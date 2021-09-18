import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import { CreateAccount, CREATE_ACCOUNT_MUTATION } from "../create-account";
import { render, RenderResult, waitFor } from "../../test.utils";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__generated__/globalTypes";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  //create a new mock : unless everything will be broken
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    //new function that you want to mock
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

describe("<CreateAccount/>", () => {
  let mockClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockClient = createMockClient();
      renderResult = render(
        <ApolloProvider client={mockClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("시작하기 | Nuber Eats");
    });
  });

  it("display the email validation error", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");
    await waitFor(() => {
      userEvent.type(email, "email@no");
    });
    const emailPatternError = getByRole("alert");
    expect(emailPatternError).toHaveTextContent("잘못된 이메일 형식입니다");
    await waitFor(() => {
      userEvent.clear(email);
    });
    const emailRequiredError = getByRole("alert");
    expect(emailRequiredError).toHaveTextContent(
      "이메일 주소를 인식할 수 없습니다"
    );
  });

  it("display the password validation error", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const password = getByPlaceholderText("비밀번호");
    await waitFor(() => {
      userEvent.type(password, "12");
    });
    const minLengthPasswordError = getByRole("alert");
    expect(minLengthPasswordError).toHaveTextContent(
      "패스워드는 10자 이상이어야 합니다"
    );
    await waitFor(() => {
      userEvent.clear(password);
    });
    const passwordRequiredError = getByRole("alert");
    expect(passwordRequiredError).toHaveTextContent(
      "패스워드를 인식할 수 없습니다"
    );
  });

  it("submits mutation with form values && success ? history push ", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");
    const password = getByPlaceholderText("비밀번호");
    const submitBtn = getByRole("button");
    const formData = {
      email: "real@test.com",
      password: "1212121212",
      role: UserRole.Client,
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: null,
        },
      },
    });
    mockClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedMutationResponse
    );
    jest.spyOn(window, "alert").mockImplementation(() => null);
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        ...formData,
      },
    });
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
  });

  it("display mutation error", async () => {
    const { getByPlaceholderText, getByRole } = renderResult;
    const email = getByPlaceholderText("이메일");
    const password = getByPlaceholderText("비밀번호");
    const submitBtn = getByRole("button");
    const formData = {
      email: "real@test.com",
      password: "1212121212",
      role: UserRole.Client,
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: false,
          error: "mutation-error",
        },
      },
    });
    mockClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedMutationResponse
    );
    await waitFor(() => {
      userEvent.type(email, formData.email);
      userEvent.type(password, formData.password);
      userEvent.click(submitBtn);
    });
    expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      createAccountInput: {
        ...formData,
      },
    });
    const mutationErrorMessage = getByRole("alert");

    expect(mutationErrorMessage).toHaveTextContent("mutation-error");
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
