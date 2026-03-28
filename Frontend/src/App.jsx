import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import React, { useContext } from "react";
import Navbar from "./components/Navbar";
import PredictorsPage from "./pages/PredictorsPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import BreastPage from "./pages/BreastPage";
import LungPage from "./pages/LungPage";
import HeartPage from "./pages/HeartPage";
import DiabetesPage from "./pages/DiabetesPage";
import { UserContext, UserContextProvider } from "./context/UserContext";

// --- NEW IMPORTS FOR THE ADVANCED DASHBOARD ---
import DashboardLayout from "./pages/DashboardLayout";
import AnalyticsOverview from "./pages/AnalyticsOverview";
import HistoryTable from "./pages/HistoryTable";
import MediBotChatPage from "./pages/MediBotChatPage"; // ADDED
import UserProfile from "./pages/UserProfile"; // ADDED
import Chatbot from "./components/Chatbot";

// Standard Layout (Navbar + Content + Floating Bot)
const Layout = () => (
  <div>
    <Navbar />
    <Outlet />
    <Chatbot /> 
  </div>
);

const ProtectedRoute = () => {
  const { userInfo, loading } = useContext(UserContext);
  if (loading) return <div>Loading...</div>;
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <UserContextProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* 1. Auth Routes (No Navbar) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* 2. Main Site Routes (With Navbar) */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/predictors" element={<PredictorsPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* 3. Protected Predictor Pages */}
              <Route element={<ProtectedRoute />}>
                <Route path="/predictors/heart" element={<HeartPage />} />
                <Route path="/predictors/lung" element={<LungPage />} />
                <Route path="/predictors/breast" element={<BreastPage />} />
                <Route path="/predictors/diabetes" element={<DiabetesPage />} />
                
                {/* 4. THE ADVANCED DASHBOARD (Nested Routes) */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<AnalyticsOverview />} /> 
                  <Route path="history" element={<HistoryTable />} /> 
                  <Route path="chat" element={<MediBotChatPage />} /> {/* FIXED BLANK PAGE */}
                  <Route path="profile" element={<UserProfile />} /> {/* FIXED BLANK PAGE */}
                </Route>
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </UserContextProvider>
  );
}

export default App;