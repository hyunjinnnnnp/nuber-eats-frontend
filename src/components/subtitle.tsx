import React from "react";

interface ISubtitleProps {
  subtitle: string;
}

export const Subtitle: React.FC<ISubtitleProps> = ({ subtitle }) => (
  <h5 className="w-full text-left">{subtitle}</h5>
);
