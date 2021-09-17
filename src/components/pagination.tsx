import React, { ReactEventHandler } from "react";

interface IPaginationProps {
  page: number;
  totalPages?: number | null;
  onPrevPageClick: ReactEventHandler;
  onNextPageClick: ReactEventHandler;
}

export const Pagination: React.FC<IPaginationProps> = ({
  page,
  totalPages,
  onPrevPageClick,
  onNextPageClick,
}) => (
  <div className="grid grid-cols-3 text-center items-center max-w-xs mx-auto mt-10">
    {page > 1 ? (
      <button
        onClick={onPrevPageClick}
        className="focus:outline-none text-lg font-bold"
      >
        &larr;
      </button>
    ) : (
      <div></div>
    )}
    <span className="mx-5">
      {page} of {totalPages}
    </span>
    {page !== totalPages ? (
      <button
        onClick={onNextPageClick}
        className="focus:outline-none text-lg font-bold"
      >
        &rarr;
      </button>
    ) : (
      <div></div>
    )}
  </div>
);
