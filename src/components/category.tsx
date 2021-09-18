import React from "react";
import { Link } from "react-router-dom";

interface ICategoryProps {
  coverImg?: string;
  categoryName?: string;
  categorySlug: string;
  className?: string;
}

export const Category: React.FC<ICategoryProps> = ({
  coverImg,
  categoryName,
  categorySlug,
  className,
}) => (
  <Link to={`/category/${categorySlug}`}>
    <div
      className={`flex flex-col justify-center items-center mx-auto group cursor-pointer ${className}`}
    >
      <div
        className="w-14 h-14 mx-3 rounded-full bg-cover bg-center shadow-sm group-hover:shadow-md group-hover:bg-gray-100"
        style={{ backgroundImage: `url(${coverImg})` }}
      ></div>
      {categoryName && (
        <span className="text-sm font-semibold mt-2 text-center">
          {categoryName}
        </span>
      )}
    </div>
  </Link>
);
