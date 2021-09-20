describe("edit profile", () => {
  const user = cy;
  beforeEach(() => {
    user.login("imhjinnnnn@gmail.com", "1212121212");
  });
  it("can go to /edit-profile using the header", () => {
    user.get('a[href="/edit-profile"]').click();
    user.assertTitle("프로필 수정");
  });
  it("can change email", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body.operatinName === "editProfileMutation") {
        // @ts-ignore
        req.body?.variables?.input?.email = "imhjinnnnn@gmail.com";
      }
    });
    user.visit("/edit-profile");
    user.findByPlaceholderText("이메일").clear().type("new@blabla.co");
    user.findByRole("button").click();
  });
});
