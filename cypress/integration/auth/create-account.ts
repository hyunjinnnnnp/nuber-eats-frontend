describe("create account", () => {
  const user = cy;
  it("should see email, password validation errors", () => {
    user.visit("/");
    user.findByText("계정 만들기").click();
    user.findByPlaceholderText("이메일").type("imhjinnnnn");
    user.findByPlaceholderText("비밀번호").type("1212");
    user
      .findAllByRole("alert")
      .should(
        "have.text",
        "잘못된 이메일 형식입니다패스워드는 10자 이상이어야 합니다"
      );
    user.findByPlaceholderText("이메일").clear();
    user.findByPlaceholderText("비밀번호").clear();
    user
      .findAllByRole("alert")
      .should(
        "have.text",
        "이메일 주소를 인식할 수 없습니다패스워드를 인식할 수 없습니다"
      );
  });
  it("should be able to create account and login", () => {
    //pretending the user doesn't exist>> INTERCEPTING
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      //to avoiding reply to EVERY mutation and query
      if (operationName && operationName === "createAccountMutation") {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: "CreateAccountOutput",
              },
            },
          });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText("이메일").type("imhjinnnnn@gmail.com");
    user.findByPlaceholderText("비밀번호").type("1212121212");
    user.findByRole("button").click();
    user.wait(1000);
    user.title().should("eq", "로그인 | Nuber Eats");
    user.findByPlaceholderText("이메일").type("imhjinnnnn@gmail.com");
    user.findByPlaceholderText("비밀번호").type("1212121212");
    user.findByRole("button").click();
    user.window().its("localStorage.nuber-token").should("be.a", "string");
  });
});
