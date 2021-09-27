import React from "react";

interface IDishProps {
  description: string;
  name: string;
  price: number;
}

export const Dish: React.FC<IDishProps> = ({ description, name, price }) => {
  return (
    <div className="px-8 py-4 border hover:border-gray-800 transition-all">
      <div className="mb-5">
        <h4 className="text-lg font-medium">{description}</h4>
        <h3 className="font-medium">{name}</h3>
      </div>
      <span>${price}</span>
    </div>
  );
};