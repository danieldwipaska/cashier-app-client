import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './routes/Home/Home';
import FoodAndBeverage from './routes/FoodAndBeverage/FoodAndBeverage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaymentHistory from './routes/PaymentHistory/PaymentHistory';
import Login from './routes/Login/Login';
import { AuthProvider } from './context/AuthContext';
import Register from './routes/Register/Register';

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
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fnb" element={<FoodAndBeverage />} />
              <Route path="/report" element={<PaymentHistory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
