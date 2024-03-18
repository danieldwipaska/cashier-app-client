import React from 'react';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Home from './routes/Home/Home';
import FoodAndBeverage from './routes/FoodAndBeverage/FoodAndBeverage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PaymentHistory from './routes/PaymentHistory/PaymentHistory';

function App() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { refetchOnWindowFocus: false },
    },
  });

  return (
    <div className="App">
      <QueryClientProvider client={client}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fnb" element={<FoodAndBeverage />} />
            <Route path="/report" element={<PaymentHistory />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </div>
  );
}

export default App;
