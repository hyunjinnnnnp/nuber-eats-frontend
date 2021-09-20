import React from "react";
import { render } from "../../test.utils";
import { Title } from "../title";

describe("<Title />", () => {
  it("renders OK", () => {
    const titleProps = {
      title: "title",
      className: "className",
    };
    const { container, getByText } = render(
      <Title title={titleProps.title} className={titleProps.className}>
        {titleProps.title}
      </Title>
    );
    getByText(titleProps.title);
    expect(container.firstChild).toHaveClass(titleProps.className);
  });
});
