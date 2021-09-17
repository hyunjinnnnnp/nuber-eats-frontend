import React from "react";
import { Link } from "react-router-dom";
import nuberLogo from "../images/logo.svg";

interface ILogoProps {
  styles?: string;
}

export const Logo: React.FC<ILogoProps> = ({ styles }) => (
  <Link to="/">
    <img src={nuberLogo} className={styles ? styles : ""} alt="logo" />
  </Link>
);
