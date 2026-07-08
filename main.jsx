import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import LandingPage from "./landing.jsx";
import LoginPage from "./login.jsx";
import SignupPage from "./signup.jsx";
import DashboardPage from "./dashboard.jsx";
import AIRecommendationsPage from "./ai-recommendations.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ai" element={<AIRecommendationsPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
