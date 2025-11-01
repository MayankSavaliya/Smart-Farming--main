import React, { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from './ProductCard';
import { useDebounce } from '../hooks/useDebounce';

const AllProducts = React.memo(() => {
  const { products, searchQuery } = useAppContext();
  
  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    if (debouncedSearchQuery.length > 0) {
      return products.filter(product =>
        product.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }
    return products;
  }, [products, debouncedSearchQuery]);

  // Memoize in-stock products
  const inStockProducts = useMemo(() => {
    return filteredProducts.filter((product) => product.inStock);
  }, [filteredProducts]);

  return (
    <div className="mt-16 flex flex-col gap-6">
      {/* Heading */}
      <div>
        <p className="text-2xl font-medium uppercase">All Products</p>
        <div className="w-16 h-0.5 bg-primary rounded-full mt-1" />
        {debouncedSearchQuery && (
          <p className="text-sm text-gray-500 mt-2">
            Showing results for "{debouncedSearchQuery}" ({inStockProducts.length} products)
          </p>
        )}
      </div>

      {/* Product List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6">
        {inStockProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Fallback if no products */}
      {inStockProducts.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
});

AllProducts.displayName = 'AllProducts';

export default AllProducts;



