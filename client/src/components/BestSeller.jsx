import React, { useMemo } from 'react';
import ProductCard from './ProductCard';
import { useAppContext } from '../context/AppContext';

const BestSeller = React.memo(() => {
  const { products } = useAppContext();

  // Memoize filtered products to avoid recalculation
  const inStockProducts = useMemo(() => {
    return products
      .filter((product) => product.inStock)
      .slice(0, 5);
  }, [products]);

  return (
    <div className="mt-16">
      <p className='text-2xl md:text-3xl font-medium '>Best Sellers</p>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
      {inStockProducts.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
      </div>
    </div>
  );
});

BestSeller.displayName = 'BestSeller';

export default BestSeller;
