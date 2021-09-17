import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  categoryQuery,
  categoryQueryVariables,
} from "../../__generated__/categoryQuery";

const CATEGORY_QUERY = gql`
  query categoryQuery($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      category {
        ...CategoryParts
      }
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${CATEGORY_FRAGMENT}
  ${RESTAURANT_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

export const Category = () => {
  //   const location = useLocation();
  //   useEffect(() => {
  // const [_, slug] = location.pathname.split("/category/");
  //   }, [location]);
  const params = useParams<ICategoryParams>();
  const { slug } = params;
  const { data, loading } = useQuery<categoryQuery, categoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page: 1,
          slug,
        },
      },
    }
  );
  console.log(data);
  return <h1>Category</h1>;
};
