import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './routes/Home/Home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaymentHistory from './routes/PaymentHistory/PaymentHistory';
import Login from './routes/Login/Login';
import { AuthProvider } from './context/AuthContext';
import Register from './routes/Register/Register';
import GiftCard from './routes/GiftCard/GiftCard';
import Settings from './routes/Settings/Settings';
import Backoffices from './routes/Backoffices/Backoffices';
import Products from './routes/Backoffices/Products/Products';
import Categories from 'routes/Backoffices/Categories/Categories';
import ProductDetails from 'routes/Backoffices/Products/ProductDetails';
import ProductAdd from 'routes/Backoffices/Products/ProductAdd';
import ProductEdit from 'routes/Backoffices/Products/ProductEdit';
import CategoryAdd from 'routes/Backoffices/Categories/CategoryAdd';
import CategoryEdit from 'routes/Backoffices/Categories/CategoryEdit';
import Reports from 'routes/Backoffices/Reports/Reports';
import Crews from 'routes/Backoffices/Crews/Crews';
import CrewsAdd from 'routes/Backoffices/Crews/CrewsAdd';
import CrewEdit from 'routes/Backoffices/Crews/CrewsEdit';
import PaymentMethods from 'routes/Backoffices/PaymentMethods/PaymentMethods';
import PaymentMethodAdd from 'routes/Backoffices/PaymentMethods/PaymentMethodAdd';
import PaymentMethodEdit from 'routes/Backoffices/PaymentMethods/PaymentMethodEdit';
import Cards from 'routes/Backoffices/Cards/Cards';
import CardAdd from 'routes/Backoffices/Cards/CardAdd';
import { MessageProvider } from 'context/MessageContext';
import BackofficeSettings from 'routes/Backoffices/Settings/Settings';

function App() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { refetchOnWindowFocus: false },
    },
  });

  return (
    <div className="App">
      <AuthProvider>
        <QueryClientProvider client={client}>
          <MessageProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/report" element={<PaymentHistory />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/gift-card" element={<GiftCard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/backoffices" element={<Backoffices />} />
                <Route path="/backoffices/products" element={<Products />} />
                <Route path="/backoffices/products/:productId" element={<ProductDetails />} />
                <Route path="/backoffices/products/:productId/edit" element={<ProductEdit />} />
                <Route path="/backoffices/products/add" element={<ProductAdd />} />
                <Route path="/backoffices/categories" element={<Categories />} />
                <Route path="/backoffices/categories/add" element={<CategoryAdd />} />
                <Route path="/backoffices/categories/:categoryId/edit" element={<CategoryEdit />} />
                <Route path="/backoffices/reports" element={<Reports />} />
                <Route path="/backoffices/crews" element={<Crews />} />
                <Route path="/backoffices/crews/add" element={<CrewsAdd />} />
                <Route path="/backoffices/crews/:crewId/edit" element={<CrewEdit />} />
                <Route path="/backoffices/payment-methods" element={<PaymentMethods />} />
                <Route path="/backoffices/payment-methods/add" element={<PaymentMethodAdd />} />
                <Route path="/backoffices/payment-methods/:paymentMethodId/edit" element={<PaymentMethodEdit />} />
                <Route path="/backoffices/cards" element={<Cards />} />
                <Route path="/backoffices/cards/add" element={<CardAdd />} />
                <Route path="/backoffices/settings" element={<BackofficeSettings />} />
              </Routes>
            </Router>
          </MessageProvider>
        </QueryClientProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
