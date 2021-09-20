import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import notFoundImg from "../images/404.svg";

export const NotFound = () => (
  <div className="h-screen flex flex-col items-center justify-center">
    <Helmet>
      <title>404 | Nuber Eats</title>
    </Helmet>
    <img src={notFoundImg} alt="icecream" />
    <h2 className="text-3xl font-semibold mb-2">Nothing to eat here...</h2>
    <h4 className="font-light mb-6">Let’s discover something delicious.</h4>
    <Link
      className="hover:bg-gray-900 bg-black text-white text-lg p-4 w-full max-w-md text-center"
      to="/"
    >
      Go back home
    </Link>
  </div>
);
