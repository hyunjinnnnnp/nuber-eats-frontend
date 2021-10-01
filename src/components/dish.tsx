import React from "react";
import { restaurantQuery_restaurant_restaurant_menu_options } from "../__generated__/restaurantQuery";

interface IDishProps {
  id?: number;
  description: string;
  name: string;
  price: number;
  isCustomer?: boolean;
  options?: restaurantQuery_restaurant_restaurant_menu_options[] | null;
  orderStarted?: boolean;
  isSelected?: boolean;
  addItemToOrder?: (dishId: number) => void;
  removeFromOrder?: (dishId: number) => void;
}

export const Dish: React.FC<IDishProps> = ({
  id = 0,
  description,
  name,
  price,
  isCustomer = false,
  orderStarted = false, // OWNER component
  options,
  isSelected,
  addItemToOrder,
  removeFromOrder,
  children: dishOptions,
}) => {
  const onClick = () => {
    if (orderStarted) {
      if (!isSelected && addItemToOrder) {
        return addItemToOrder(id);
      }
      if (isSelected && removeFromOrder) {
        return removeFromOrder(id);
      }
    }
  };
  return (
    <div
      className={`p-4 border transition-all ${
        isSelected ? "border-gray-800" : "hover:border-gray-800 cursor:pointer"
      }`}
    >
      <div className="mb-5">
        <h3 className="text-lg font-medium flex justify-between items-center">
          {name}
          {orderStarted && (
            <button
              onClick={onClick}
              className={`text-white text-sm font-medium hover:transition-colors p-1 ${
                isSelected
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-lime-500 hover:bg-lime-600"
              }
            `}
            >
              {isSelected ? "Remove" : "Add"}
            </button>
          )}
        </h3>
        <h4 className="font-normal text-sm">{description}</h4>
      </div>
      <span>${price}</span>
      {isCustomer && options && options?.length !== 0 && (
        <div>
          <h5 className="mt-8 mb-3 font-medium">- 옵션 추가하기</h5>
          {dishOptions}
        </div>
      )}
    </div>
  );
};
