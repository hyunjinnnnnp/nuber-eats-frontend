import { getAllByAltText } from "@testing-library/dom";
import React from "react";
import { render } from "../../test.utils";
import { Logo } from "../logo";

describe("<Logo />", () => {
  it("renders OK", () => {
    const { container } = render(<Logo styles="styles" />);

    expect(container.firstChild).toHaveAttribute("href", "/");
    expect(container.firstChild?.firstChild).toHaveClass("styles");
  });
});
