import React from "react";
import { render } from "../../test.utils";
import { Category } from "../category";

describe("<Category />", () => {
  it("renders OK", () => {
    const { getByText, container } = render(
      <Category
        coverImg="coverImg"
        categoryName="categoryName"
        categorySlug="categorySlug"
        className="className"
      />
    );
    getByText("categoryName");
    expect(container.firstChild).toHaveAttribute(
      "href",
      "/category/categorySlug"
    );
  });
});
