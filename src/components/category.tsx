import React from "react";

interface ICategoryProps {
  coverImg?: string;
  categoryName: string;
}

export const Category: React.FC<ICategoryProps> = ({
  coverImg,
  categoryName,
}) => (
  <div className="flex flex-col justify-center items-center mx-auto group cursor-pointer">
    <div
      className="w-14 h-14 mx-3 rounded-full bg-cover shadow-sm group-hover:shadow-md group-hover:bg-gray-100"
      style={{ backgroundImage: `url(${coverImg})` }}
    ></div>
    <span className="text-sm font-semibold mt-2 text-center">
      {categoryName}
    </span>
  </div>
);
