import React from "react";
import { render } from "../../test.utils";
import { Pagination } from "../pagination";

describe("<Pagination />", () => {
  it("renders OK", () => {
    const { getByText } = render(
      <Pagination
        page={1}
        totalPages={2}
        onPrevPageClick={() => {
          return null;
        }}
        onNextPageClick={() => {
          return null;
        }}
      />
    );
    getByText("1 of 2");
  });
});
