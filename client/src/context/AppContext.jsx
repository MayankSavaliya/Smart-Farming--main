import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials=true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "";
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState("");


  //fetch seller Status (optimized with useCallback)
  const fetchSeller = useCallback(async()=>{
    try { 
      const{data} = await axios.get('/api/seller/is-auth');
      if(data.success){
        setIsSeller(true)
      }
      else{
          setIsSeller(false)

      }
    } catch (error) {
        setIsSeller(false)
    }
  }, []);


  //fetch user auth status,user data and cart items (optimized with useCallback)
  const fetchUser = useCallback(async()=>{
    try {
      const {data} = await axios.get('/api/user/is-auth');
      if(data.success){
        setUser(data.user)
        setCartItems(data.user.cartItems)
      }
    } catch (error) {
      setUser(null)
    }
  }, []);



  // Fetch all products (optimized with useCallback)
  const fetchProducts = useCallback(async () => {
    try {
      const{data} = await axios.get('/api/product/list')
      if(data.success){
        setProducts(data.products)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
              toast.error(error.message)

    }

  }, []);

  // Add product to cart (optimized with useCallback)
  const addToCart = useCallback((itemId) => {
    setCartItems(prevCart => {
      const cartData = structuredClone(prevCart);
      if (cartData[itemId]) {
        cartData[itemId] += 1;
      } else {
        cartData[itemId] = 1;
      }
      return cartData;
    });
    toast.success("Added to cart");
  }, []);

  // Update cart item quantity (optimized with useCallback)
  const updateCartItem = useCallback((itemId, quantity) => {
    setCartItems(prevCart => {
      const cartData = structuredClone(prevCart);
      cartData[itemId] = quantity;
      return cartData;
    });
    toast.success("Cart updated");
  }, []);

  // Remove product from cart (optimized with useCallback)
  const removeFromCart = useCallback((itemId) => {
    setCartItems(prevCart => {
      const cartData = structuredClone(prevCart);
      if (cartData[itemId]) {
        cartData[itemId] -= 1;

        if (cartData[itemId] === 0) {
          delete cartData[itemId];
        }
      }
      return cartData;
    });
    toast.success("Removed from cart");
  }, []);

  // get cart item count (optimized with useMemo)
  const getCartCount = useMemo(()=>{
    let count = 0;
    for (const key in cartItems) {
      count += cartItems[key];
    }
    return count;
  }, [cartItems]);

  //get cart total price (optimized with useMemo)
  const getCartAmount = useMemo(() => {
    let total = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo && cartItems[items]>0) {
        total += itemInfo.offerPrice * cartItems[items];
      }
    }
    return Math.floor(total*100)/100;
  }, [cartItems, products]);

  // Load dummy products on mount
  useEffect(() => {
    fetchUser()
    fetchSeller()
    fetchProducts();
  }, [fetchUser, fetchSeller, fetchProducts]);


  //update database cart items
useEffect(() => {
  const updateCart = async () => {
    try {
      const { data } = await axios.post('/api/cart/update', {
        userId: user._id,
        cartItems,
      });

      if (!data.success) {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (user) {
    updateCart();
  }
}, [cartItems, user]);




  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    axios,
    fetchProducts,
    setCartItems

  }), [
    navigate,
    user,
    isSeller,
    showUserLogin,
    products,
    currency,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    searchQuery,
    getCartCount,
    getCartAmount,
    fetchProducts
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
