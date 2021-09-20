describe("First test", () => {
  it("should go to homepage", () => {
    cy.visit("http://localhost:3000")
      .title()
      .should("eq", "로그lk인 | Nuber Eats");
  });
});
