import React from "react";

interface IDishOptionProps {
  isSelected: boolean;
  name: string;
  extra?: number | null;
  dishId: number;
  addOptionToItem: (dishId: number, optioName: string) => void;
  removeOptionFromItem: (dishId: number, optioName: string) => void;
}

export const DishOption: React.FC<IDishOptionProps> = ({
  isSelected,
  name,
  extra,
  addOptionToItem,
  removeOptionFromItem,
  dishId,
}) => {
  const onClick = () => {
    if (isSelected) {
      removeOptionFromItem(dishId, name);
    } else {
      addOptionToItem(dishId, name);
    }
  };
  return (
    <span
      onClick={onClick}
      className={`flex items-center justify-between border mt-2 px-2 ${
        isSelected ? "border-gray-900 bg-gray-100 bg-opacity-40" : "opacity-40"
      }`}
    >
      <h6 className="mr-2">{isSelected ? `- ${name}` : `+ ${name}`}</h6>
      <h6 className="text-sm opacity-75">{extra ? `($${extra})` : `($0)`}</h6>
    </span>
  );
};
