import React from "react";

interface IRestaurantProps {
  coverImg: string;
  name: string;
  address: string;
  categoryName?: string;
  id: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  coverImg,
  name,
  address,
  categoryName,
}) => (
  <div className="flex flex-col">
    <div
      className="py-10 bg-cover bg-center mb-2"
      style={{ backgroundImage: `url(${coverImg})` }}
    ></div>
    <h3 className="text-lg font-medium">{name}</h3>
    <span className="text-xs font-thin">{address}</span>
    <span className="text-xs font-thin border-gray-100 border-t-2 border-opacity-40 mt-4 py-2">
      {categoryName}
    </span>
  </div>
);
