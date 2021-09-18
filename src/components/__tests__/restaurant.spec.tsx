import { render } from "@testing-library/react";
import React from "react";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Restaurant />", () => {
  it("renders OK with props", () => {
    const restaurantProps = {
      coverImg: "coverImg",
      name: "name",
      address: "address",
      categoryName: "categoryName",
      id: "id",
    };
    const { debug, getByText, container } = render(
      <Router>
        <Restaurant {...restaurantProps} />
      </Router>
    );
    getByText(restaurantProps.name);
    getByText(restaurantProps.address);
    getByText(restaurantProps.categoryName);
    expect(container.firstChild).toHaveAttribute(
      "href",
      `/restaurant/${restaurantProps.id}`
    );
  });
});
