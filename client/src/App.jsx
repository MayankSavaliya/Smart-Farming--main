import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import {Toaster} from "react-hot-toast";
import Footer from './components/Footer';
import Login from './components/Login';
import { useAppContext } from './context/AppContext';

// Lazy load all page components for code splitting
const Home = lazy(() => import('./pages/Home'));
const AllProducts = lazy(() => import('./components/AllProducts'));
const ProductCategory = lazy(() => import('./pages/ProductCategory'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const AddAddress = lazy(() => import('./pages/AddAddress'));
const MyOrders = lazy(() => import('./pages/MyOrders'));

// Seller components - lazy loaded
const SellerLogin = lazy(() => import('./components/seller/SellerLogin'));
const SellerLayout = lazy(() => import('./pages/seller/SellerLayout'));
const AddProduct = lazy(() => import('./pages/seller/AddProduct'));
const ProductList = lazy(() => import('./pages/seller/ProductList'));
const Orders = lazy(() => import('./pages/seller/Orders'));

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller");
  const {showUserLogin,isSeller} = useAppContext()

  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
      {!isSellerPath && <Navbar />}
      {showUserLogin ? <Login/> : null}      

      <Toaster />

      <div className={`${!isSellerPath ? "px-6 md:px-16 lg:px-24 xl:px-32" : ""}`}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/products' element={<AllProducts />} />
            <Route path='/products/:category' element={<ProductCategory />} />
            <Route path='/products/:category/:id' element={<ProductDetails />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/add-address' element={<AddAddress />} />
            <Route path='/my-orders' element={<MyOrders />} />
            
            <Route path='/seller' element={isSeller ? <SellerLayout/> :<SellerLogin/> }>
              <Route index element={isSeller ? <AddProduct/> : null}/>
              <Route path = 'product-list' element={<ProductList/> }/>
              <Route path = 'orders' element={<Orders/> }/>
            </Route>

          </Routes>
        </Suspense>
      </div>
      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
