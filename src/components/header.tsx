import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { Logo } from "./logo";

export const Header = () => {
  //CUSTOM HOOKS with query
  const { data } = useMe();
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-white text-center text-xs">
          <span>Please verify your email</span>
        </div>
      )}
      <header className="container py-2 md:py-4 md:px-4 flex items-center justify-between">
        <Logo />
        <Link to="/edit-profile">
          <FontAwesomeIcon icon={faUser} className="text-lg" />
        </Link>
      </header>
    </>
  );
};
