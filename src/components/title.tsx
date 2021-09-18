import React from "react";

interface ITitleProps {
  title: string;
  className?: string;
}

export const Title: React.FC<ITitleProps> = ({ title, className }) => (
  <h4
    className={`w-full font-normal text-left text-3xl mb-10  md:mt-12 ${className}`}
  >
    {title}
  </h4>
);
