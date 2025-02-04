import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Account from "./pages/Account";
import ErrorBoundary from "./components/ErrorBoundary";

const App: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/account" /> : <Navigate to="/login" />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
