import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../components/Card";
import heartImage from "../assets/heart.png";
import lungImage from "../assets/lung.png";
import diabetesImage from "../assets/diabetes.png";
import breastImage from "../assets/breast.png";
import { UserContext } from "../context/UserContext";
import "../App.css";

function PredictorsPage() {
  const { userInfo } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCardClick = (path) => {
    // Open your browser console (F12) to see this message when you click
    console.log("Checking login status. User info is:", userInfo);

    if (userInfo) {
      navigate(path);
    } else {
      toast.info("Please log in to access this predictor.", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="predictor-container">
      <ToastContainer theme="colored" />
      <p className="description">
        The Comprehensive Health Diagnostics Suite utilizes advanced AI
        technology for early detection and precise prediction...
      </p>
      <div className="card-container">
        {/* THIS FIXES THE LAYOUT: Using the original className="card" */}
        <div
          onClick={() => handleCardClick("/predictors/heart")}
          className="card"
        >
          <Card
            image={heartImage}
            title="Heart Disease"
            description="Guarding Hearts: AI solutions for accurate prediction and early intervention in heart disease."
          />
        </div>
        <div
          onClick={() => handleCardClick("/predictors/lung")}
          className="card"
        >
          <Card
            image={lungImage}
            title="Lung Cancer"
            description="Clearing the Air: AI-driven insights for proactive lung cancer prediction and care."
          />
        </div>
        <div
          onClick={() => handleCardClick("/predictors/breast")}
          className="card"
        >
          <Card
            image={breastImage}
            title="Breast Cancer"
            description="Beyond Detection: AI innovation for early, precise breast cancer prediction and care."
          />
        </div>
        <div
          onClick={() => handleCardClick("/predictors/diabetes")}
          className="card"
        >
          <Card
            image={diabetesImage}
            title="Diabetes"
            description="Empowering Health: AI solutions for precise diabetes prediction and proactive wellness."
          />
        </div>
      </div>
    </div>
  );
}

export default PredictorsPage;

