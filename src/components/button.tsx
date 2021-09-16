import React from "react";

interface IButtonProps {
  canClick: boolean;
  loading: boolean;
  actionText: string;
}

export const Button: React.FC<IButtonProps> = ({
  canClick,
  loading,
  actionText,
}) => (
  <button
    className={`text-white transition-colors p-3 font-medium ${
      !canClick
        ? "bg-gray-300 pointer-events-none"
        : "bg-lime-500 hover:bg-lime-600"
    }`}
  >
    {loading ? "로딩 중" : actionText}
  </button>
);
