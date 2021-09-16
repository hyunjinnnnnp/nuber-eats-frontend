import React from "react";
import nuberLogo from "../images/logo.svg";

interface ILogoProps {
  styles?: string;
}

export const Logo: React.FC<ILogoProps> = ({ styles }) => (
  <img src={nuberLogo} className={styles ? styles : ""} alt="logo" />
);
