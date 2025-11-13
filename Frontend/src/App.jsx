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
import SignupPage from "./pages/SignUpPage";
import HomePage from "./pages/HomePage";
import BreastPage from "./pages/BreastPage";
import LungPage from "./pages/LungPage";
import HeartPage from "./pages/HeartPage";
import DiabetesPage from "./pages/DiabetesPage";
import { UserContext, UserContextProvider } from "./context/UserContext";

// This component adds the Navbar to every page nested inside it.
const Layout = () => (
  <div>
    <Navbar />
    <Outlet /> {/* The actual page content will be rendered here */}
  </div>
);

// This is our "Bouncer". It checks for a user and redirects if they're not logged in.
const ProtectedRoute = () => {
  const { userInfo, loading } = useContext(UserContext);

  if (loading) {
    return <div>Loading...</div>; // Prevents page flashing
  }

  // If user is logged in, show the requested page. Otherwise, redirect to login.
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <UserContextProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Routes without a Navbar */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* All routes inside here will have a Navbar */}
            <Route element={<Layout />}>
              {/* Public pages */}
              <Route path="/" element={<HomePage />} />
              <Route path="/predictors" element={<PredictorsPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* All routes inside here are PROTECTED and need login */}
              <Route element={<ProtectedRoute />}>
                <Route path="/predictors/heart" element={<HeartPage />} />
                <Route path="/predictors/lung" element={<LungPage />} />
                <Route path="/predictors/breast" element={<BreastPage />} />
                <Route
                  path="/predictors/diabetes"
                  element={<DiabetesPage />}
                />
              </Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </UserContextProvider>
  );
}

export default App;

