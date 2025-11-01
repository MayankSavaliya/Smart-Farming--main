import React, { useCallback } from 'react';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import LazyImage from './LazyImage';

const ProductCard = React.memo(({ product }) => {
  const {
    currency,
    addToCart,
    removeFromCart,
    cartItems,
    navigate
  } = useAppContext();

  // Memoize click handlers
  const handleCardClick = useCallback(() => {
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
    scrollTo(0, 0);
  }, [navigate, product.category, product._id]);

  const handleAddToCart = useCallback((e) => {
    e.stopPropagation();
    addToCart(product._id);
  }, [addToCart, product._id]);

  const handleRemoveFromCart = useCallback((e) => {
    e.stopPropagation();
    removeFromCart(product._id);
  }, [removeFromCart, product._id]);

  if (!product) return null;

  return (
    <div
      onClick={handleCardClick}
      className="border border-gray-500/20 rounded-md md:px-4 px-3 py-2 bg-white min-w-56 max-w-56 w-full cursor-pointer"
    >
      {/* Image Section with Lazy Loading */}
      <div className="group flex items-center justify-center px-2">
        <LazyImage
          className="group-hover:scale-105 transition max-w-26 md:max-w-36"
          src={product.image[0]}
          alt={product.name || 'product'}
        />
      </div>

      {/* Product Info */}
      <div className="text-gray-500/60 text-sm mt-2">
        <p>{product.category}</p>
        <p className="text-gray-700 font-medium text-lg truncate w-full">
          {product.name}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-0.5 mt-1">
          {Array(5).fill('').map((_, i) => (
            <img
              key={i}
              className="md:w-3.5 w-3"
              src={i < product.rating ? assets.star_icon : assets.star_dull_icon}
              alt="star"
            />
          ))}
          <p>({product.ratingCount || 4})</p>
        </div>

        {/* Price and Cart Controls */}
        <div className="flex items-end justify-between mt-3">
          {/* Price */}
          <p className="md:text-xl text-base font-medium text-primary">
            {currency}{product.offerPrice}
            <span className="text-gray-500/60 md:text-sm text-xs line-through ml-1">
              {currency}{product.price}
            </span>
          </p>

          {/* Cart Buttons */}
          <div onClick={(e) => e.stopPropagation()} className="text-primary">
            {!cartItems[product._id] ? (
              <button
                className="flex items-center justify-center gap-1 bg-primary/10 border border-primary/40 md:w-[80px] w-[64px] h-[34px] rounded cursor-pointer"
                onClick={handleAddToCart}
              >
                <img src={assets.cart_icon} alt="cart_icon" />
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 md:w-20 w-16 h-[34px] bg-primary/25 rounded select-none">
                <button
                  onClick={handleRemoveFromCart}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  -
                </button>
                <span className="w-5 text-center">
                  {cartItems[product._id]}
                </span>
                <button
                  onClick={handleAddToCart}
                  className="cursor-pointer text-md px-2 h-full"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
