import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Background from "./components/Background";
import Header from "./components/Header";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";

import LoginPage from "./pages/LoginPage";

import ProtectedRoute from "./ProtectedRoute";
import PresetParameter from "./pages/PresetParameter";
import Preprocessing from "./pages/Preprocessing";
import FileImportPage from "./pages/FileImportPage";
import ModelBuild from "./pages/ModelBuildPage";
import ModelPredict from "./pages/ModelPredictPage";

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
              path="/file"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <FileImportPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preprocessing"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Preprocessing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preset"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <PresetParameter />
                </ProtectedRoute>
              }
            />
            <Route
              path="/modelbuild"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ModelBuild />
                </ProtectedRoute>
              }
            />
            <Route
              path="/modelpredict"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <ModelPredict />
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
