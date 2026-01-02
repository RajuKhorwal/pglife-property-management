// src/pages/Booking.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card, Breadcrumb, Spinner } from "react-bootstrap";
import { FaCalendar, FaUsers, FaClock, FaMoneyBillWave, FaCheckCircle, FaInfoCircle, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { AppContext } from "../context/AppContext";

const API_BASE = "http://localhost:5000/api";

export default function Booking() {
  const { id } = useParams(); // property ID
  const navigate = useNavigate();
  const { user, tokenHeader } = useContext(AuthContext);
  const { setShowLogin } = useContext(AppContext);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    moveInDate: "",
    duration: "1",
    numberOfPeople: "1",
    specialRequests: "",
  });

  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error("Please login to book a property");
      setShowLogin(true);
      navigate("/");
      return;
    }
    fetchPropertyDetails();
  }, [id, user]);

  const fetchPropertyDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE}/properties/${id}`);
      setProperty(res.data.property);
    } catch (err) {
      console.error("Error fetching property:", err);
      toast.error("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    if (!property) return 0;
    const months = parseInt(formData.duration) || 1;
    return property.rent * months;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.moveInDate) {
      toast.error("Please select a move-in date");
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        propertyId: id,
        moveInDate: formData.moveInDate,
        duration: parseInt(formData.duration),
        numberOfPeople: parseInt(formData.numberOfPeople),
        specialRequests: formData.specialRequests,
        totalAmount: calculateTotal(),
      };

      const res = await axios.post(
        `${API_BASE}/bookings`,
        bookingData,
        { headers: tokenHeader }
      );

      toast.success("Booking successful! 🎉");
      navigate("/dashboard");
    } catch (err) {
      console.error("Booking error:", err);
      toast.error(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" style={{ color: "#667eea" }} />
        <p style={{ marginTop: "15px", color: "#6b7280" }}>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <Container className="mt-5 text-center">
        <h3>Property not found</h3>
        <Button onClick={() => navigate("/")} variant="primary">Go Home</Button>
      </Container>
    );
  }

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

          * {
            font-family: 'Poppins', sans-serif;
          }

          .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 400px;
          }

          .booking-page {
            background: #f9fafb;
            min-height: 100vh;
            padding-bottom: 60px;
          }

          .booking-breadcrumb-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 25px 0;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .booking-breadcrumb {
            margin: 0;
            padding: 0;
            background: transparent;
          }

          .booking-breadcrumb .breadcrumb-item a {
            color: rgba(255, 255, 255, 0.9);
            text-decoration: none;
          }

          .booking-breadcrumb .breadcrumb-item.active {
            color: white;
          }

          .booking-breadcrumb .breadcrumb-item + .breadcrumb-item::before {
            color: rgba(255, 255, 255, 0.7);
          }

          .page-title {
            color: white;
            font-size: 2.5rem;
            font-weight: 700;
            margin-top: 15px;
            text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
          }

          .booking-container {
            padding: 40px 0;
          }

          .property-summary-card {
            background: white;
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
          }

          .property-summary-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          }

          .property-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 15px;
            margin-bottom: 20px;
          }

          .property-name {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 10px;
          }

          .property-address {
            color: #6b7280;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .property-rent {
            font-size: 2rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .rent-period {
            color: #9ca3af;
            font-size: 14px;
          }

          .booking-form-card {
            background: white;
            border-radius: 20px;
            padding: 35px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            position: sticky;
            top: 20px;
          }

          .form-section-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .form-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .form-control,
          .form-select {
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            padding: 12px 16px;
            transition: all 0.3s ease;
            font-size: 14px;
          }

          .form-control:focus,
          .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
            outline: none;
          }

          textarea.form-control {
            min-height: 100px;
            resize: vertical;
          }

          .info-card {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            border-left: 4px solid #667eea;
          }

          .info-title {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .info-text {
            color: #6b7280;
            font-size: 14px;
            line-height: 1.6;
          }

          .summary-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            color: white;
          }

          .summary-title {
            font-size: 1.2rem;
            font-weight: 700;
            margin-bottom: 20px;
          }

          .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          }

          .summary-row:last-child {
            border-bottom: none;
            padding-top: 20px;
            margin-top: 10px;
            border-top: 2px solid rgba(255, 255, 255, 0.3);
            font-size: 1.3rem;
            font-weight: 700;
          }

          .summary-label {
            opacity: 0.9;
          }

          .summary-value {
            font-weight: 600;
          }

          .book-button {
            background: white;
            color: #667eea;
            border: none;
            padding: 16px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            width: 100%;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .book-button:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
            background: #f3f4f6;
          }

          .book-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .user-info-section {
            background: #f9fafb;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
          }

          .user-info-title {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 15px;
            font-size: 15px;
          }

          .user-info-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 0;
            color: #6b7280;
            font-size: 14px;
          }

          .user-info-icon {
            width: 35px;
            height: 35px;
            border-radius: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
          }

          @media (max-width: 768px) {
            .booking-form-card {
              position: static;
            }

            .page-title {
              font-size: 2rem;
            }

            .property-name {
              font-size: 1.5rem;
            }
          }
        `}
      </style>

      <div className="booking-page">
        {/* Breadcrumb */}
        <div className="booking-breadcrumb-section">
          <Container>
            <Breadcrumb className="booking-breadcrumb">
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                Home
              </Breadcrumb.Item>
              <Breadcrumb.Item
                linkAs={Link}
                linkProps={{ to: `/property_detail/${id}` }}
              >
                Property Details
              </Breadcrumb.Item>
              <Breadcrumb.Item active>Booking</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="page-title">Complete Your Booking</h1>
          </Container>
        </div>

        {/* Main Content */}
        <Container className="booking-container">
          <Row>
            {/* Left Column - Property Summary */}
            <Col lg={7}>
              <div className="property-summary-card">
                {property.images && property.images[0] && (
                  <img
                    src={
                      property.images[0].startsWith("/uploads")
                        ? `http://localhost:5000${property.images[0]}`
                        : property.images[0]
                    }
                    alt={property.name}
                    className="property-image"
                  />
                )}
                
                <h2 className="property-name">{property.name}</h2>
                <p className="property-address">
                  📍 {property.address}
                </p>
                
                <div style={{ marginBottom: "20px" }}>
                  <span className="property-rent">₹ {property.rent.toLocaleString()}</span>
                  <span className="rent-period"> / month</span>
                </div>

                <div className="info-card">
                  <div className="info-title">
                    <FaInfoCircle /> Booking Information
                  </div>
                  <div className="info-text">
                    • Your booking is subject to availability confirmation<br />
                    • Security deposit may be required<br />
                    • Cancellation policy: 7 days notice required<br />
                    • Contact property owner for specific terms
                  </div>
                </div>

                <div className="user-info-section">
                  <div className="user-info-title">Your Contact Information</div>
                  <div className="user-info-item">
                    <div className="user-info-icon"><FaUser /></div>
                    <span>{user?.full_name}</span>
                  </div>
                  <div className="user-info-item">
                    <div className="user-info-icon"><FaEnvelope /></div>
                    <span>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="user-info-item">
                      <div className="user-info-icon"><FaPhone /></div>
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </Col>

            {/* Right Column - Booking Form */}
            <Col lg={5}>
              <div className="booking-form-card">
                <h3 className="form-section-title">
                  <FaCalendar /> Booking Details
                </h3>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaCalendar /> Move-In Date
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.moveInDate}
                      onChange={(e) =>
                        setFormData({ ...formData, moveInDate: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaClock /> Duration (Months)
                    </Form.Label>
                    <Form.Select
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: e.target.value })
                      }
                      required
                    >
                      {[1, 2, 3, 4, 5, 6, 9, 12].map((m) => (
                        <option key={m} value={m}>
                          {m} {m === 1 ? "Month" : "Months"}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaUsers /> Number of People
                    </Form.Label>
                    <Form.Select
                      value={formData.numberOfPeople}
                      onChange={(e) =>
                        setFormData({ ...formData, numberOfPeople: e.target.value })
                      }
                      required
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "Person" : "People"}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Special Requests (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={formData.specialRequests}
                      onChange={(e) =>
                        setFormData({ ...formData, specialRequests: e.target.value })
                      }
                      placeholder="Any special requirements or preferences..."
                    />
                  </Form.Group>

                  {/* Booking Summary */}
                  <div className="summary-section">
                    <div className="summary-title">Booking Summary</div>
                    <div className="summary-row">
                      <span className="summary-label">Monthly Rent</span>
                      <span className="summary-value">₹ {property.rent.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Duration</span>
                      <span className="summary-value">{formData.duration} {formData.duration === "1" ? "Month" : "Months"}</span>
                    </div>
                    <div className="summary-row">
                      <span className="summary-label">Total Amount</span>
                      <span className="summary-value">₹ {calculateTotal().toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="book-button"
                    disabled={bookingLoading}
                  >
                    {bookingLoading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaCheckCircle />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}