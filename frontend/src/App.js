// frontend/src/App.js
import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PropertyList from "./pages/PropertyList";
import PropertyDetail from "./pages/PropertyDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Booking from "./pages/Booking";

import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="app-container">
            <Header />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/property_list/:city" element={<PropertyList />} />
                <Route
                  path="/property_detail/:id"
                  element={<PropertyDetail />}
                />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/booking/:id" element={<Booking />} />
              </Routes>
            </main>
            <Footer />
            {/* 🔑 Global Modals */}
            <LoginModalWrapper />
            <SignupModalWrapper />
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

function LoginModalWrapper() {
  const { showLogin, setShowLogin, setShowSignup } = useContext(AppContext);
  return (
    <LoginModal
      show={showLogin}
      onHide={() => setShowLogin(false)}
      onSwitchToSignup={() => {
        setShowLogin(false);
        setShowSignup(true);
      }}
    />
  );
}

function SignupModalWrapper() {
  const { showSignup, setShowSignup, setShowLogin } = useContext(AppContext);
  return (
    <SignupModal
      show={showSignup}
      onHide={() => setShowSignup(false)}
      onSwitchToLogin={() => {
        setShowSignup(false);
        setShowLogin(true);
      }}
    />
  );
}

export default App;
