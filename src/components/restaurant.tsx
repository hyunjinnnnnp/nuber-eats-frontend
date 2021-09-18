import React from "react";
import { Link } from "react-router-dom";

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
  id,
}) => (
  <Link to={`/restaurant/${id}`}>
    <div className="flex flex-col">
      <div
        className="py-10 bg-cover bg-no-repeat bg-center mb-2 h-32"
        style={{ backgroundImage: `url(${coverImg})` }}
      ></div>
      <h3 className="text-lg font-medium">{name}</h3>
      <span className="text-xs font-thin">{address}</span>
      <span className="text-xs font-thin border-gray-100 border-t-2 border-opacity-40 mt-4 py-2">
        {categoryName}
      </span>
    </div>
  </Link>
);
