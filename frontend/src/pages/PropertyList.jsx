// frontend/src/pages/PropertyList.jsx
import React, { useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaHeart, 
  FaFilter, 
  FaSortAmountDown, 
  FaSortAmountUp,
  FaMale,
  FaFemale,
  FaUsers,
  FaMapMarkerAlt
} from "react-icons/fa";

import { AppContext } from "../context/AppContext";
import { AuthContext } from "../context/AuthContext";

export default function PropertyList() {
  const { city } = useParams();

  const {
    properties,
    setProperties,
    originalProperties,
    setOriginalProperties,
    loading,
    setLoading,
    showFilterModal,
    setShowFilterModal,
    activeFilter,
    setActiveFilter,
    fetchProperties,
    setShowLogin,
  } = useContext(AppContext);

  const { user, token, logoutOnExpire } = useContext(AuthContext);

  useEffect(() => {
    if (!city) return;
    fetchProperties(city, token);
  }, [city, token]);

  const applyFilter = (gender) => {
    setActiveFilter(gender);

    if (gender === "all") {
      setProperties(originalProperties);
    } else {
      setProperties(originalProperties.filter((p) => p.gender === gender));
    }

    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setActiveFilter("all");
    setProperties(originalProperties);
    setShowFilterModal(false);
  };

  const sortHighest = () => {
    const sorted = [...properties].sort((a, b) => b.rent - a.rent);
    setProperties(sorted);
  };

  const sortLowest = () => {
    const sorted = [...properties].sort((a, b) => a.rent - b.rent);
    setProperties(sorted);
  };

  const toggleInterest = async (propertyId, userInterested) => {
    if (!user) {
      alert("Please log in first");
      setShowLogin(true);
      return;
    }

    setProperties((prev) =>
      prev.map((p) =>
        p._id === propertyId
          ? {
              ...p,
              userInterested: !p.userInterested,
              interestedCount: p.userInterested
                ? p.interestedCount - 1
                : p.interestedCount + 1,
            }
          : p
      )
    );

    try {
      const method = userInterested ? "delete" : "post";
      await fetch(
        `http://localhost:5000/api/properties/${propertyId}/interested`,
        {
          method,
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.error("Error toggling interest:", err);
      setProperties((prev) =>
        prev.map((p) =>
          p._id === propertyId
            ? {
                ...p,
                userInterested: !p.userInterested,
                interestedCount: p.userInterested
                  ? p.interestedCount - 1
                  : p.interestedCount + 1,
              }
            : p
        )
      );

      if (
        err.response &&
        (err.response.status === 401 || err.response.status === 403)
      ) {
        logoutOnExpire();
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };

  if (loading) return <p>Loading properties...</p>;

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

          * {
            font-family: 'Poppins', sans-serif;
          }

          .property-list-page {
            background: #f9fafb;
            min-height: 100vh;
            padding-bottom: 60px;
          }

          .modern-breadcrumb-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 25px 0;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          .modern-breadcrumb {
            margin: 0;
            padding: 0;
            background: transparent;
          }

          .modern-breadcrumb .breadcrumb-item {
            font-size: 14px;
            font-weight: 500;
          }

          .modern-breadcrumb .breadcrumb-item a {
            color: rgba(255, 255, 255, 0.9);
            text-decoration: none;
            transition: all 0.3s ease;
          }

          .modern-breadcrumb .breadcrumb-item a:hover {
            color: white;
          }

          .modern-breadcrumb .breadcrumb-item.active {
            color: white;
          }

          .modern-breadcrumb .breadcrumb-item + .breadcrumb-item::before {
            color: rgba(255, 255, 255, 0.7);
          }

          .city-header {
            color: white;
            margin-top: 15px;
            font-size: 2.5rem;
            font-weight: 700;
            text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.2);
          }

          .filter-bar {
            background: white;
            padding: 20px 30px;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            margin: -30px 0 30px;
            position: relative;
            z-index: 10;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
          }

          .filter-button {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px 24px;
            border: 2px solid #e5e7eb;
            border-radius: 25px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            color: #374151;
            font-size: 14px;
          }

          .filter-button:hover {
            border-color: #667eea;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 6px 15px rgba(102, 126, 234, 0.3);
          }

          .filter-button svg {
            font-size: 16px;
          }

          .filter-button.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: #667eea;
          }

          .property-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 30px;
            margin-top: 30px;
          }

          .property-card-modern {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            transition: all 0.4s ease;
            border: 2px solid transparent;
          }

          .property-card-modern:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
            border-color: #667eea;
          }

          .property-image-wrapper {
            position: relative;
            height: 240px;
            overflow: hidden;
          }

          .property-image-wrapper img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }

          .property-card-modern:hover .property-image-wrapper img {
            transform: scale(1.15);
          }

          .property-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
          }

          .property-badge {
            position: absolute;
            top: 15px;
            left: 15px;
            background: rgba(255, 255, 255, 0.95);
            padding: 8px 16px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 13px;
            font-weight: 600;
            backdrop-filter: blur(10px);
          }

          .property-card-content {
            padding: 25px;
          }

          .property-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .star-rating {
            display: flex;
            gap: 3px;
          }

          .star-rating svg {
            color: #fbbf24;
            font-size: 14px;
          }

          .interest-badge {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .interest-badge:hover {
            transform: scale(1.1);
          }

          .interest-heart-icon {
            font-size: 24px;
            transition: all 0.3s ease;
          }

          .interest-heart-icon.active {
            color: #ef4444;
            animation: heartbeat 0.5s ease;
          }

          .interest-heart-icon.inactive {
            color: #d1d5db;
          }

          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.3); }
          }

          .interest-count {
            font-size: 11px;
            color: #6b7280;
            margin-top: 4px;
          }

          .property-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 10px;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }

          .property-address {
            display: flex;
            align-items: center;
            gap: 8px;
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 15px;
          }

          .property-address svg {
            color: #667eea;
            flex-shrink: 0;
          }

          .property-gender-tag {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            background: #f3f4f6;
            border-radius: 15px;
            font-size: 13px;
            margin-bottom: 20px;
          }

          .property-gender-tag img {
            width: 20px;
            height: 20px;
          }

          .property-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 20px;
            border-top: 2px solid #f3f4f6;
          }

          .rent-info {
            display: flex;
            flex-direction: column;
          }

          .rent-amount {
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .rent-period {
            font-size: 12px;
            color: #9ca3af;
            margin-top: -5px;
          }

          .view-property-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            padding: 10px 28px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 14px;
            color: white;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
          }

          .view-property-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            color: white;
          }

          .no-properties {
            text-align: center;
            padding: 80px 20px;
            background: white;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          }

          .no-properties-icon {
            font-size: 5rem;
            margin-bottom: 20px;
            opacity: 0.3;
          }

          .no-properties h3 {
            color: #374151;
            font-weight: 600;
            margin-bottom: 10px;
          }

          .no-properties p {
            color: #9ca3af;
          }

          /* Filter Modal Styles */
          .filter-modal .modal-content {
            border: none;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .filter-modal .modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 25px 30px;
          }

          .filter-modal .modal-title {
            font-weight: 700;
            font-size: 1.5rem;
          }

          .filter-modal .btn-close {
            filter: brightness(0) invert(1);
            opacity: 1;
          }

          .filter-modal .modal-body {
            padding: 40px 30px;
          }

          .filter-options {
            display: flex;
            justify-content: space-around;
            gap: 15px;
          }

          .filter-option-button {
            flex: 1;
            padding: 20px;
            border: 2px solid #e5e7eb;
            border-radius: 15px;
            background: white;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .filter-option-button:hover {
            border-color: #667eea;
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.2);
          }

          .filter-option-button.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-color: #667eea;
          }

          .filter-option-button svg {
            font-size: 2.5rem;
          }

          .filter-option-button span {
            font-weight: 600;
            font-size: 14px;
          }

          .filter-modal .modal-footer {
            border: none;
            padding: 20px 30px;
            background: #f9fafb;
          }

          .filter-modal .btn-secondary {
            background: #6b7280;
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
          }

          .filter-modal .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
          }

          @media (max-width: 768px) {
            .property-grid {
              grid-template-columns: 1fr;
            }

            .filter-bar {
              padding: 15px;
            }

            .filter-button {
              flex: 1;
              justify-content: center;
            }

            .city-header {
              font-size: 2rem;
            }

            .filter-options {
              flex-direction: column;
            }
          }
        `}
      </style>

      <div className="property-list-page">
        {/* Breadcrumb Section */}
        <div className="modern-breadcrumb-section">
          <Container>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb modern-breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {city}
                </li>
              </ol>
            </nav>
            <h1 className="city-header">PG in {city}</h1>
          </Container>
        </div>

        <Container>
          {/* Filter Bar */}
          <div className="filter-bar">
            <button 
              className={`filter-button ${activeFilter !== 'all' ? 'active' : ''}`}
              onClick={() => setShowFilterModal(true)}
            >
              <FaFilter />
              <span>Filter {activeFilter !== 'all' ? `(${activeFilter})` : ''}</span>
            </button>

            <button className="filter-button" onClick={sortHighest}>
              <FaSortAmountDown />
              <span>Highest Rent</span>
            </button>

            <button className="filter-button" onClick={sortLowest}>
              <FaSortAmountUp />
              <span>Lowest Rent</span>
            </button>
          </div>

          {/* Properties Grid */}
          {properties.length === 0 ? (
            <div className="no-properties">
              <div className="no-properties-icon">🏠</div>
              <h3>No Properties Found</h3>
              <p>Try adjusting your filters or check back later for new listings</p>
            </div>
          ) : (
            <div className="property-grid">
              {properties.map((property) => {
                const totalRating = Number(
                  (
                    (property.rating_clean +
                      property.rating_food +
                      property.rating_safety) /
                    3
                  ).toFixed(1)
                );

                const propertyImages = property.images || ["/img/fallback.png"];

                const genderImg =
                  property.gender === "male"
                    ? "/img/male.png"
                    : property.gender === "female"
                    ? "/img/female.png"
                    : "/img/unisex.png";

                return (
                  <div className="property-card-modern" key={property._id}>
                    {/* Image Section */}
                    <div className="property-image-wrapper">
                      <img src={propertyImages[0]} alt={property.name} />
                      <div className="property-overlay"></div>
                      <div className="property-badge">
                        <img src={genderImg} alt={property.gender} style={{ width: '16px', height: '16px' }} />
                        <span style={{ textTransform: 'capitalize' }}>{property.gender}</span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="property-card-content">
                      <div className="property-card-header">
                        <div className="star-rating">
                          {[...Array(5)].map((_, i) => {
                            if (totalRating >= i + 0.8)
                              return <FaStar key={i} />;
                            else if (totalRating >= i + 0.3)
                              return <FaStarHalfAlt key={i} />;
                            else return <FaRegStar key={i} />;
                          })}
                        </div>
                        <div 
                          className="interest-badge"
                          onClick={() => toggleInterest(property._id, property.userInterested)}
                        >
                          <FaHeart 
                            className={`interest-heart-icon ${property.userInterested ? 'active' : 'inactive'}`}
                          />
                          <div className="interest-count">
                            {property.interestedCount} interested
                          </div>
                        </div>
                      </div>

                      <h3 className="property-title">{property.name}</h3>
                      <div className="property-address">
                        <FaMapMarkerAlt />
                        <span>{property.address}</span>
                      </div>

                      <div className="property-card-footer">
                        <div className="rent-info">
                          <div className="rent-amount">₹ {property.rent.toLocaleString()}</div>
                          <div className="rent-period">per month</div>
                        </div>
                        <Link
                          to={`/property_detail/${property._id}`}
                          className="view-property-button"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Container>

        {/* Filter Modal */}
        <Modal 
          show={showFilterModal} 
          onHide={() => setShowFilterModal(false)} 
          centered
          className="filter-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>Filter Properties</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="filter-options">
              <button
                className={`filter-option-button ${activeFilter === "male" ? "active" : ""}`}
                onClick={() => applyFilter("male")}
              >
                <FaMale />
                <span>Male</span>
              </button>
              <button
                className={`filter-option-button ${activeFilter === "female" ? "active" : ""}`}
                onClick={() => applyFilter("female")}
              >
                <FaFemale />
                <span>Female</span>
              </button>
              <button
                className={`filter-option-button ${activeFilter === "unisex" ? "active" : ""}`}
                onClick={() => applyFilter("unisex")}
              >
                <FaUsers />
                <span>Unisex</span>
              </button>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFilterModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={resetFilters}>
              Reset Filters
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}