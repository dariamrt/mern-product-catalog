import { Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './src/contexts/CartContext';
import ProtectedRoute from './src/components/ProtectedRoute.jsx';

import AuthLayout from './src/layouts/AuthLayout.jsx';
import GlobalLayout from './src/layouts/GlobalLayout.jsx';

import Login from './src/pages/Login.jsx';
import Register from './src/pages/Register.jsx';
import ProductCatalog from './src/pages/ProductCatalog.jsx';
import ProductDetails from './src/pages/ProductDetails.jsx';
import Profile from './src/pages/Profile.jsx';
import Dashboard from './src/pages/Dashboard.jsx';
import Cart from './src/pages/Cart.jsx';
import OrderDetails from './src/pages/OrderDetails.jsx';

const App = () => {
  return (
    <CartProvider>
      <Routes>
        {/* auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* public */}
        <Route element={<GlobalLayout />}>
          <Route path="/" element={<ProductCatalog />} />
          <Route path="/products" element={<ProductCatalog />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Route>

        {/* protected */}
        <Route
          element={
            <ProtectedRoute>
              <GlobalLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CartProvider>
  );
};

export default App;