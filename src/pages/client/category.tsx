import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { useParams } from "react-router";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  categoryQuery,
  categoryQueryVariables,
} from "../../__generated__/categoryQuery";
import { Title } from "../../components/title";
import { Restaurant } from "../../components/restaurant";
import { Pagination } from "../../components/pagination";
import { Helmet } from "react-helmet-async";

export const CATEGORY_QUERY = gql`
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
  const [categoryName, setCategoryName] = useState("Category");
  const [page, setPage] = useState(1);
  const params = useParams<ICategoryParams>();
  const { slug } = params;
  useEffect(() => {
    setCategoryName(slug);
  }, [slug]);

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  const { data, loading } = useQuery<categoryQuery, categoryQueryVariables>(
    CATEGORY_QUERY,
    {
      variables: {
        input: {
          page,
          slug,
        },
      },
    }
  );
  return (
    <>
      <Helmet>
        <title>카테고리 | Nuber Eats</title>
      </Helmet>
      {!loading && (
        <div className="container">
          <Title
            title={categoryName ? `${categoryName} 탐색하기` : "카테고리"}
          />
          <div className="grid md:grid-cols-3 gap-x-5 gap-y-10 mt-8 px-10">
            {data?.category.restaurants?.map((restaurant) => (
              <Restaurant
                key={restaurant.id}
                coverImg={restaurant.coverImg}
                name={restaurant.name}
                address={restaurant.address}
                categoryName={restaurant.category?.name}
                id={restaurant.id + ""}
              />
            ))}
            <Pagination
              page={page}
              totalPages={data?.category.totalPages}
              onPrevPageClick={onPrevPageClick}
              onNextPageClick={onNextPageClick}
            />
          </div>
        </div>
      )}
    </>
  );
};
