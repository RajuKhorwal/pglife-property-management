// frontend/src/pages/Home.jsx
import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, InputGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaHome, FaStar } from "react-icons/fa";

import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import { AppContext } from "../context/AppContext";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const { showLogin, setShowLogin, showSignup, setShowSignup, fetchProperties } = useContext(AppContext);
  const { tokenHeader } = useContext(AuthContext);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (city.trim()) {
      await fetchProperties(city, tokenHeader);
      navigate(`/property_list/${encodeURIComponent(city)}`);
    }
  };

  const cities = [
    { name: "Delhi", img: "delhi.png", gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
    { name: "Mumbai", img: "mumbai.png", gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
    { name: "Bengaluru", img: "bangalore.png", gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
    { name: "Hyderabad", img: "hyderabad.png", gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
  ];

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&display=swap');
          
          * {
            font-family: 'Poppins', sans-serif;
          }

          .hero-section {
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.95) 0%, rgba(168, 85, 247, 0.95) 100%),
                        url('/img/bg.png');
            background-size: cover;
            background-position: center;
            background-attachment: fixed;
            min-height: 75vh;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }

          .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
            animation: pulse 8s ease-in-out infinite;
          }

          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }

          .hero-content {
            position: relative;
            z-index: 2;
            text-align: center;
            color: white;
            max-width: 800px;
            padding: 20px;
          }

          .hero-title {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.3);
            animation: fadeInUp 1s ease-out;
          }

          .hero-subtitle {
            font-size: 1.3rem;
            font-weight: 300;
            margin-bottom: 2.5rem;
            opacity: 0.95;
            animation: fadeInUp 1s ease-out 0.2s both;
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .search-container {
            animation: fadeInUp 1s ease-out 0.4s both;
            max-width: 600px;
            margin: 0 auto;
          }

          .search-box {
            background: white;
            border-radius: 50px;
            padding: 8px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
          }

          .search-box:hover {
            box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
            transform: translateY(-2px);
          }

          .search-box input {
            border: none;
            padding: 12px 24px;
            font-size: 1.1rem;
            background: transparent;
          }

          .search-box input:focus {
            box-shadow: none;
            outline: none;
          }

          .search-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 50px;
            padding: 12px 30px;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .search-button:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
          }

          .section-title {
            font-size: 2.5rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 3rem;
            color: #1f2937;
            position: relative;
            display: inline-block;
            left: 50%;
            transform: translateX(-50%);
          }

          .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
          }

          .city-card {
            background: white;
            border-radius: 20px;
            padding: 40px 20px;
            margin: 20px auto;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            position: relative;
            overflow: hidden;
          }

          .city-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--gradient);
            opacity: 0;
            transition: opacity 0.4s ease;
            z-index: 0;
          }

          .city-card:hover::before {
            opacity: 0.1;
          }

          .city-card:hover {
            transform: translateY(-15px) scale(1.05);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          }

          .city-icon-wrapper {
            width: 120px;
            height: 120px;
            margin: 0 auto 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: var(--gradient);
            transition: all 0.4s ease;
            position: relative;
            z-index: 1;
          }

          .city-card:hover .city-icon-wrapper {
            transform: rotate(360deg) scale(1.1);
          }

          .city-icon-wrapper img {
            width: 70px;
            height: 70px;
            filter: brightness(0) invert(1);
            position: relative;
            z-index: 1;
          }

          .city-name {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
            margin-top: 15px;
            transition: all 0.3s ease;
            position: relative;
            z-index: 1;
          }

          .city-card:hover .city-name {
            color: #667eea;
            transform: scale(1.1);
          }

          .features-section {
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            padding: 80px 0;
            margin-top: 80px;
          }

          .feature-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            height: 100%;
          }

          .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
          }

          .feature-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .feature-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 10px;
          }

          .feature-text {
            color: #6b7280;
            font-size: 0.95rem;
          }

          @media (max-width: 768px) {
            .hero-title {
              font-size: 2.2rem;
            }

            .hero-subtitle {
              font-size: 1rem;
            }

            .section-title {
              font-size: 2rem;
            }

            .city-card {
              margin: 15px auto;
            }
          }
        `}
      </style>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Home</h1>
          <p className="hero-subtitle">
            Happiness per Square Foot - Discover comfortable PG accommodations in top cities
          </p>
          <div className="search-container">
            <Form onSubmit={handleSearch}>
              <div className="search-box">
                <InputGroup>
                  <InputGroup.Text style={{ background: 'transparent', border: 'none' }}>
                    <FaMapMarkerAlt style={{ color: '#667eea' }} />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter your city to find PG accommodations"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                  <Button type="submit" className="search-button">
                    <FaSearch /> Search
                  </Button>
                </InputGroup>
              </div>
            </Form>
          </div>
        </div>
      </div>

      {/* Major Cities Section */}
      <Container className="my-5 py-5">
        <h2 className="section-title">Explore Major Cities</h2>
        <Row className="justify-content-center">
          {cities.map((c) => (
            <Col key={c.name} lg={3} md={6} sm={6} xs={12} className="mb-4">
              <div
                className="city-card"
                style={{ '--gradient': c.gradient }}
                onClick={() => navigate(`/property_list/${c.name}`)}
              >
                <div className="city-icon-wrapper">
                  <img
                    src={`/img/${c.img}`}
                    alt={c.name}
                  />
                </div>
                <h3 className="city-name">{c.name}</h3>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Features Section */}
      <div className="features-section">
        <Container>
          <h2 className="section-title">Why Choose PG Life?</h2>
          <Row>
            <Col md={4} className="mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaHome />
                </div>
                <h3 className="feature-title">Verified Properties</h3>
                <p className="feature-text">
                  All our PG accommodations are verified and inspected for quality and safety
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaStar />
                </div>
                <h3 className="feature-title">Best Prices</h3>
                <p className="feature-text">
                  Get the best deals on comfortable and affordable PG accommodations
                </p>
              </div>
            </Col>
            <Col md={4} className="mb-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaMapMarkerAlt />
                </div>
                <h3 className="feature-title">Prime Locations</h3>
                <p className="feature-text">
                  Find PGs in the most convenient locations with easy access to transport
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modals */}
      <LoginModal
        show={showLogin}
        onHide={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />
      <SignupModal
        show={showSignup}
        onHide={() => setShowSignup(false)}
        onSwitchToLogin={() => {
          setShowSignup(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}