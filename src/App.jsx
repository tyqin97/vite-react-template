import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Background from "./components/Background";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";

import HomePage from "./pages/Home";
import LoginPage from "./pages/LoginPage";

import ProtectedRoute from "./ProtectedRoute";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return JSON.parse(localStorage.getItem("isAuthenticated"));
  });

  return (
    <Router>
      <div className="app">
        <Header />
        <SideBar
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />

        <div className="main-content no-scrollbar">
          <Routes>
            <Route
              path="/login"
              element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Background />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <HomePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
