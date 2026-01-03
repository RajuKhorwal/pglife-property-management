// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { Container, Row, Col, Button, Breadcrumb } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaHeart,
  FaEdit,
  FaEnvelope,
  FaPhone,
  FaUniversity,
  FaMapMarkerAlt,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import { Modal, Form } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { AppContext } from "../context/AppContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser, token, authLoading } = useContext(AuthContext);
  const { interestedProperties, setInterestedProperties } =
    useContext(AppContext);
  const [showEdit, setShowEdit] = useState(false);
  const API_BASE =
    "https://pglife-property-management-backend.onrender.com" ||
    "http://localhost:5000";
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    college_name: "",
  });

  useEffect(() => {
    if (!authLoading && (!user || !token)) {
      navigate("/");
    }
  }, [authLoading, user, token, navigate]);

  useEffect(() => {
    if (user) {
      fetch(`${API_BASE}/api/users/${user._id}/interested`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setInterestedProperties(data.properties || []);
        })
        .catch(console.error);
    }
  }, [user, token, setInterestedProperties]);

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || "",
        phone: user.phone || "",
        college_name: user.college_name || "",
      });
    }
  }, [user]);

  const handleSave = async () => {
    if (form.avatarFile) {
      const formData = new FormData();
      formData.append("avatar", form.avatarFile);

      const res = await fetch(`${API_BASE}/api/users/${user._id}/avatar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      }
    }

    // update text fields
    const res = await fetch(`${API_BASE}/api/users/${user._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        full_name: form.full_name,
        phone: form.phone,
        college_name: form.college_name,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    setShowEdit(false);
  };

  const toggleInterest = async (propertyId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${API_BASE}/api/properties/${propertyId}/interested`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (data.success) {
        setInterestedProperties((prev) =>
          prev.filter((p) => p && p._id !== propertyId)
        );
      } else {
        alert(data.message || "Could not remove interest");
      }
    } catch (err) {
      console.error("Error removing interest:", err);
      alert("Something went wrong while removing interest");
    }
  };

  if (authLoading) {
    return <div style={{ padding: 50, textAlign: "center" }}>Loading...</div>;
  }

  if (!user) return null;

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

          * {
            font-family: 'Poppins', sans-serif;
          }

          .modern-breadcrumb {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            padding: 15px 0;
            margin-bottom: 0;
          }

          .modern-breadcrumb .breadcrumb {
            background: transparent;
            margin: 0;
            padding: 0;
          }

          .modern-breadcrumb .breadcrumb-item a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .modern-breadcrumb .breadcrumb-item a:hover {
            color: #764ba2;
          }

          .modern-breadcrumb .breadcrumb-item.active {
            color: #6b7280;
          }

          .dashboard-container {
            background: #f9fafb;
            min-height: 100vh;
            padding: 40px 0;
          }

          .profile-section {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin-bottom: 40px;
            position: relative;
            overflow: hidden;
          }

          .profile-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 120px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 0;
          }

          .section-title {
            font-size: 2rem;
            font-weight: 700;
            color: white;
            margin-bottom: 30px;
            position: relative;
            z-index: 1;
          }

          .profile-content {
            position: relative;
            z-index: 1;
          }

          .profile-avatar-container {
            text-align: center;
            margin-bottom: 20px;
          }

          .profile-avatar {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            border: 6px solid white;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 4rem;
            margin: 0 auto;
            transition: transform 0.3s ease;
          }

          .profile-avatar:hover {
            transform: scale(1.05);
          }

          .profile-info {
            background: #f9fafb;
            border-radius: 15px;
            padding: 30px;
            margin-top: 20px;
          }

          .profile-name {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 20px;
            text-align: center;
          }

          .profile-detail {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 15px;
          }

          .profile-detail:last-child {
            border-bottom: none;
          }

          .profile-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            flex-shrink: 0;
          }

          .edit-profile-button {
            position: absolute;
            top: 30px;
            right: 30px;
            background: white;
            color: #667eea;
            border: 2px solid white;
            padding: 10px 24px;
            border-radius: 25px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 2;
          }

          .edit-profile-button:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }

          .properties-section {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          }

          .properties-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 30px;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .properties-title .icon {
            color: #ef4444;
            font-size: 1.5rem;
          }

          .property-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            margin-bottom: 25px;
            transition: all 0.3s ease;
            border: 2px solid transparent;
          }

          .property-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
            border-color: #667eea;
          }

          .property-image-container {
            position: relative;
            height: 220px;
            overflow: hidden;
          }

          .property-image-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .property-card:hover .property-image-container img {
            transform: scale(1.1);
          }

          .property-content {
            padding: 20px;
          }

          .property-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .star-rating {
            display: flex;
            gap: 3px;
          }

          .star-rating i {
            color: #fbbf24;
            font-size: 14px;
          }

          .interest-heart {
            color: #ef4444;
            font-size: 24px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .interest-heart:hover {
            transform: scale(1.2);
            filter: brightness(1.2);
          }

          .property-name {
            font-size: 1.3rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 8px;
          }

          .property-address {
            color: #6b7280;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            margin-bottom: 12px;
          }

          .property-gender {
            display: inline-block;
            margin-bottom: 15px;
          }

          .property-gender img {
            width: 30px;
            height: 30px;
            padding: 5px;
            background: #f3f4f6;
            border-radius: 8px;
          }

          .property-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #e5e7eb;
          }

          .property-rent {
            font-size: 1.5rem;
            font-weight: 700;
            color: #667eea;
          }

          .property-rent-unit {
            font-size: 12px;
            color: #9ca3af;
          }

          .view-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            padding: 10px 30px;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
          }

          .view-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          }

          .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #9ca3af;
          }

          .empty-state-icon {
            font-size: 4rem;
            margin-bottom: 20px;
            opacity: 0.3;
          }

          /* Edit Modal Styles */
          .edit-modal .modal-content {
            border: none;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .edit-modal .modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 25px 30px;
          }

          .edit-modal .modal-title {
            font-weight: 700;
            font-size: 1.5rem;
          }

          .edit-modal .btn-close {
            filter: brightness(0) invert(1);
            opacity: 1;
          }

          .edit-modal .modal-body {
            padding: 30px;
          }

          .edit-modal .form-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
          }

          .edit-modal .form-control {
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            padding: 12px 16px;
            transition: all 0.3s ease;
          }

          .edit-modal .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          }

          .edit-modal .modal-footer {
            border: none;
            padding: 20px 30px;
            background: #f9fafb;
          }

          .edit-modal .btn-secondary {
            background: #6b7280;
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
          }

          .edit-modal .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
          }

          .edit-modal .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }

          @media (max-width: 768px) {
            .profile-section {
              padding: 30px 20px;
            }

            .properties-section {
              padding: 30px 20px;
            }

            .edit-profile-button {
              position: static;
              margin-top: 20px;
              width: 100%;
              justify-content: center;
            }

            .property-image-container {
              height: 200px;
            }
          }
        `}
      </style>

      <div className="modern-breadcrumb">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </div>

      <div className="dashboard-container">
        <Container>
          {/* Profile Section */}
          <div className="profile-section">
            <h2 className="section-title">My Profile</h2>
            <button
              className="edit-profile-button"
              onClick={() => setShowEdit(true)}
            >
              <FaEdit /> Edit Profile
            </button>

            <div className="profile-content">
              <Row>
                <Col lg={3} md={4}>
                  <div className="profile-avatar-container">
                    {user.avatar_url ? (
                      <img
                        src={user?.avatar_url || "/img/fallback.png"}
                        alt="Profile"
                        className="profile-avatar"
                      />
                    ) : (
                      <div className="profile-avatar">
                        <FaUser />
                      </div>
                    )}
                  </div>
                </Col>

                <Col lg={9} md={8}>
                  <div className="profile-info">
                    <div className="profile-name">{user.full_name}</div>

                    <div className="profile-detail">
                      <div className="profile-icon">
                        <FaEnvelope />
                      </div>
                      <div>
                        <strong>Email:</strong> {user.email}
                      </div>
                    </div>

                    <div className="profile-detail">
                      <div className="profile-icon">
                        <FaPhone />
                      </div>
                      <div>
                        <strong>Phone:</strong> {user.phone || "Not provided"}
                      </div>
                    </div>

                    <div className="profile-detail">
                      <div className="profile-icon">
                        <FaUniversity />
                      </div>
                      <div>
                        <strong>College:</strong>{" "}
                        {user.college_name || "Not provided"}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          {/* Interested Properties */}
          <div className="properties-section">
            <h2 className="properties-title">
              <FaHeart className="icon" />
              My Interested Properties
            </h2>

            {interestedProperties.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">💔</div>
                <h3>No Interested Properties Yet</h3>
                <p>Start exploring and save your favorite properties!</p>
              </div>
            ) : (
              <Row>
                {interestedProperties
                  .filter((property) => property)
                  .map((property) => {
                    const totalRating =
                      Math.round(
                        ((property.rating_clean +
                          property.rating_food +
                          property.rating_safety) /
                          3) *
                          10
                      ) / 10;

                    let genderImg = "/img/unisex.png";
                    if (property.gender === "male") genderImg = "/img/male.png";
                    else if (property.gender === "female")
                      genderImg = "/img/female.png";

                    const propertyImages = property.images || [
                      "/img/fallback.png",
                    ];

                    return (
                      <Col lg={6} key={property._id}>
                        <div className="property-card">
                          <div className="property-image-container">
                            <img src={propertyImages[0]} alt={property.name} />
                          </div>

                          <div className="property-content">
                            <div className="property-header">
                              <div className="star-rating">
                                {[...Array(5)].map((_, i) => {
                                  if (totalRating >= i + 0.8)
                                    return <FaStar key={i} />;
                                  else if (totalRating >= i + 0.3)
                                    return <FaStarHalfAlt key={i} />;
                                  else
                                    return (
                                      <i key={i} className="far fa-star"></i>
                                    );
                                })}
                              </div>
                              <FaHeart
                                className="interest-heart"
                                onClick={() => toggleInterest(property._id)}
                              />
                            </div>

                            <div className="property-name">{property.name}</div>
                            <div className="property-address">
                              <FaMapMarkerAlt />
                              {property.address}
                            </div>
                            <div className="property-gender">
                              <img src={genderImg} alt={property.gender} />
                            </div>

                            <div className="property-footer">
                              <div>
                                <div className="property-rent">
                                  ₹ {property.rent.toLocaleString()}
                                </div>
                                <div className="property-rent-unit">
                                  per month
                                </div>
                              </div>
                              <Button
                                className="view-button"
                                onClick={() =>
                                  navigate(`/property_detail/${property._id}`)
                                }
                              >
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Col>
                    );
                  })}
              </Row>
            )}
          </div>
        </Container>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        show={showEdit}
        onHide={() => setShowEdit(false)}
        className="edit-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                value={form.full_name}
                onChange={(e) =>
                  setForm({ ...form, full_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>College</Form.Label>
              <Form.Control
                type="text"
                value={form.college_name}
                onChange={(e) =>
                  setForm({ ...form, college_name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setForm({ ...form, avatarFile: e.target.files[0] })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEdit(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
