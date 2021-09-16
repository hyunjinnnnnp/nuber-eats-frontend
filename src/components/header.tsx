import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { Logo } from "./logo";

//SOLUTION 1: PASSING PROPS

// interface IHeaderProps {
//   email: string;
// }

export const Header = () => {
  //SOLUTION 2: CUSTOM HOOKS with query

  const { data } = useMe();
  return (
    <header className="w-full px-5 py-2 md:py-4 md:px-10 flex items-center justify-between">
      <Logo />
      <Link to="/my-profile">
        <FontAwesomeIcon icon={faUser} className="text-lg" />
      </Link>
    </header>
  );
};
