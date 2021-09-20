describe("Log in", () => {
  const user = cy;
  it("should see login page", () => {
    user.visit("/").title().should("eq", "로그인 | Nuber Eats");
  });
  it("can se email and password validation errors", () => {
    user.visit("/");
    user.findByPlaceholderText("이메일").type("imhjin");
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
  it("can fill out the form and login", () => {
    user.visit("/");
    user.findByPlaceholderText("이메일").type("imhjinnnnn@gmail.com");
    user.findByPlaceholderText("비밀번호").type("1212121212");
    user
      .findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();
    user.window().its("localStorage.nuber-token").should("be.a", "string");
  });
});
