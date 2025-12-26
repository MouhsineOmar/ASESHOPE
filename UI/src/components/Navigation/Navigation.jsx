import React, { useState } from "react";
import { Wishlist } from "../common/Wishlist";
import { AccountIcon } from "../common/AccountIcon";
import { CartIcon } from "../common/CartIcon";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector } from "react-redux";
import { countCartItems } from "../../store/features/cart";

const Navigation = ({ variant = "default" }) => {
  const cartLength = useSelector(countCartItems);
  const navigate = useNavigate();

  const [q, setQ] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;

    // ✅ Redirection vers ProductCherche.js
    navigate(`/productcherche?q=${encodeURIComponent(query)}`);
  };

  return (
    <nav className="flex items-center py-3 px-10 justify-between gap-6 custom-nav">
      {/* Logo */}
      <div className="flex items-center gap-6">
        <Link className="text-2xl text-black font-bold" to="/">
          ShopEase
        </Link>
      </div>

      {/* Nav items */}
      {variant === "default" && (
        <div className="hidden md:flex flex-wrap items-center">
          <ul className="flex gap-10 text-gray-600">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink to="/men" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Men
              </NavLink>
            </li>
            <li>
              <NavLink to="/women" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Women
              </NavLink>
            </li>
          </ul>
        </div>
      )}

      {/* Search bar like Chrome */}
      {variant === "default" && (
        <div className="flex-1 flex justify-center">
          <form
            onSubmit={handleSearch}
            className="
              w-full max-w-3xl
              bg-white
              rounded-full
              px-3 py-2
              flex items-center gap-2
              shadow-sm
              ring-1 ring-black/5
            "
          >
            {/* Search icon */}
            <button
              type="submit"
              className="shrink-0 text-gray-500 hover:text-gray-800"
              aria-label="Search"
              title="Search"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 18a8 8 0 1 1 5.293-14.001A8 8 0 0 1 10 18Zm0-2a6 6 0 1 0-4.243-10.243A6 6 0 0 0 10 16Zm8.707 5.707-4.11-4.11 1.414-1.414 4.11 4.11a1 1 0 0 1-1.414 1.414Z" />
              </svg>
            </button>

            {/* Input */}
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rechercher sur Google ou saisir une URL"
              className="flex-1 bg-transparent outline-none text-[15px] text-gray-800 placeholder:text-gray-500"
            />

            {/* Mic */}
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 p-1"
              aria-label="Voice search"
              title="Recherche vocale"
              onClick={() => console.log("mic")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Zm5-3a1 1 0 1 1 2 0 7 7 0 0 1-6 6.93V20h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-2.07A7 7 0 0 1 5 11a1 1 0 1 1 2 0 5 5 0 0 0 10 0Z" />
              </svg>
            </button>

            {/* Camera */}
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 p-1"
              aria-label="Search by image"
              title="Recherche par image"
              onClick={() => console.log("camera")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 4 7.17 6H5a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-2.17L15 4H9Zm3 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              </svg>
            </button>

            {/* Mode IA (cache sur petit écran) */}
            <button
              type="button"
              className="
                hidden sm:inline-flex items-center gap-2
                rounded-full
                px-3 py-1.5
                text-xs font-medium
                bg-white
                ring-1 ring-gray-200
                hover:bg-gray-50
                whitespace-nowrap
              "
              onClick={() => console.log("AI mode")}
            >
              <span className="h-5 w-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white grid place-items-center">
                ✦
              </span>
              Mode IA
            </button>
          </form>
        </div>
      )}

      {/* Action Icons */}
      <div className="flex flex-wrap items-center gap-4">
        {variant === "default" && (
          <ul className="flex gap-6 items-center">
            <li>
              <button type="button" aria-label="Wishlist">
                <Wishlist />
              </button>
            </li>
            <li>
              <button type="button" aria-label="Account" onClick={() => navigate("/account-details/profile")}>
                <AccountIcon />
              </button>
            </li>
            <li className="relative">
              <Link to="/cart-items" className="flex">
                <CartIcon />
                {cartLength > 0 && (
                  <span className="absolute -right-3 -top-2 inline-flex items-center justify-center h-6 w-6 bg-black text-white rounded-full text-xs border-2 border-white">
                    {cartLength}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        )}

        {variant === "auth" && (
          <ul className="flex gap-4">
            <li className="text-black border border-black hover:bg-slate-100 font-medium rounded-lg text-sm px-5 py-2.5">
              <NavLink to="/v1/login" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Login
              </NavLink>
            </li>
            <li className="text-black border border-black hover:bg-slate-100 font-medium rounded-lg text-sm px-5 py-2.5">
              <NavLink to="/v1/register" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Signup
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
