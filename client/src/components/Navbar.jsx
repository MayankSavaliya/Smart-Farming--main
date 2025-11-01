// src/components/Navbar.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useDebounce } from "../hooks/useDebounce";
import toast from "react-hot-toast";

const Navbar = React.memo(() => {
  const [open, setOpen] = useState(false);
  const {
    user,
    setUser,
    setShowUserLogin,
    navigate,
    searchQuery,
    setSearchQuery,
    getCartCount,
    axios
  } = useAppContext();

  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoize cart count to prevent recalculation
  const cartCount = useMemo(() => getCartCount, [getCartCount]);

  // Memoized logout function
  const logout = useCallback(async () => {
    try {
      const {data} = await axios.get('/api/user/logout')
      if(data.success){
        toast.success("Logged out successfully")
        setUser(null);
        navigate("/");
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }, [axios, setUser, navigate]);

  // Memoized navigation handlers
  const handleCartClick = useCallback(() => {
    navigate("/cart");
  }, [navigate]);

  const handleMyOrders = useCallback(() => {
    navigate("/my-orders");
    setOpen(false);
  }, [navigate]);

  const handleShowLogin = useCallback(() => {
    setShowUserLogin(true);
  }, [setShowUserLogin]);

  // Navigate to /products on debounced search input
  useEffect(() => {
    if (debouncedSearchQuery.length > 0) {
      navigate("/products");
    }
  }, [debouncedSearchQuery, navigate]);

  

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative">
      {/* Logo */}
      <NavLink to="/" onClick={() => setOpen(false)}>
        <img className="h-9" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All Products</NavLink>
        <NavLink to="/">Contact</NavLink>

        {/* Search Bar */}
    <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search products"
    aria-label="Search products"
    className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
  />
  <button type="button" aria-label="Search">
    <img src={assets.search_icon} alt="search icon" className="w-4 h-4" />
  </button>
</div>


        {/* Cart Icon */}
        <div onClick={handleCartClick} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80" />
          
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
              {cartCount}
            </button>
          
        </div>

        {/* Login/Profile Dropdown */}
        {!user ? (
          <button
            onClick={handleShowLogin}
            className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group">
            <img src={assets.profile_icon} className="w-10" alt="profile" />
            <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-36 rounded-md text-sm z-40">
              <li
                onClick={handleMyOrders}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                My Orders
              </li>
              <li
                onClick={logout}
                className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>


      <div className="flex items-center gap-6 sm:hidden">

        <div onClick={handleCartClick} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt="cart" className="w-6 opacity-80" />
          
            <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">
              {cartCount}
            </button>
          
        </div>

          {/* Mobile Menu Button */}
        <button onClick={() => setOpen(!open)} aria-label="Menu" className="">
        <img src={assets.menu_icon} alt="menu" />
       </button>
      </div>
      

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-2 px-5 text-sm md:hidden z-50">
          <NavLink to="/" onClick={() => setOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setOpen(false)}>
            All Products
          </NavLink>
          {user && (
            <NavLink to="/my-orders" onClick={() => setOpen(false)}>
              My Orders
            </NavLink>
          )}
          <NavLink to="/" onClick={() => setOpen(false)}>
            Contact
          </NavLink>

          {!user ? (
            <button
              onClick={() => {
                setOpen(false);
                handleShowLogin();
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="cursor-pointer px-6 py-2 mt-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;
