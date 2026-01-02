// frontend/src/pages/PropertyDetail.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Row,
  Col,
  Button,
  Breadcrumb,
  Carousel,
  Container,
} from "react-bootstrap";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHeart,
  FaBroom,
  FaUtensils,
  FaLock,
  FaMapMarkerAlt,
  FaUsers,
  FaCheckCircle,
} from "react-icons/fa";

import { AppContext } from "../context/AppContext";
import { AuthContext } from "../context/AuthContext";

const API_BASE = "http://localhost:5000/api";

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    propertyDetail: property,
    setPropertyDetail: setProperty,
    amenities,
    testimonials,
    fetchPropertyDetail,
  } = useContext(AppContext);

  const { user, tokenHeader, logoutOnExpire } = useContext(AuthContext);
  const { setShowLogin } = useContext(AppContext);

  const [userRating, setUserRating] = useState({
    clean: 0,
    food: 0,
    safety: 0,
  });
  const [loadingRating, setLoadingRating] = useState(false);

  useEffect(() => {
    if (id) fetchPropertyDetail(id, tokenHeader);
  }, [id, tokenHeader]);

  const toggleInterest = async () => {
    if (!user) {
      alert("Please log in to mark interest");
      setShowLogin(true);
      return;
    }

    setProperty((prev) =>
      prev
        ? {
            ...prev,
            userInterested: !prev.userInterested,
            interestedCount:
              (prev.interestedCount || 0) + (prev.userInterested ? -1 : 1),
          }
        : prev
    );

    try {
      const method = property?.userInterested ? "delete" : "post";
      await axios({
        method,
        url: `http://localhost:5000/api/properties/${id}/interested`,
        headers: tokenHeader,
      });
    } catch (err) {
      setProperty((prev) =>
        prev
          ? {
              ...prev,
              userInterested: !prev.userInterested,
              interestedCount:
                (prev.interestedCount || 0) + (prev.userInterested ? 1 : -1),
            }
          : prev
      );

      if (err?.response?.status === 401) {
        logoutOnExpire();
        return;
      }
      console.error(err);
      alert("Error toggling interest");
    }
  };

  const handleRatingSubmit = async () => {
    if (!user) {
      alert("Please log in to submit rating");
      setShowLogin(true);
      return;
    }
    try {
      setLoadingRating(true);
      const res = await axios.post(
        `${API_BASE}/properties/${id}/rate`,
        {
          rating_clean: userRating.clean,
          rating_food: userRating.food,
          rating_safety: userRating.safety,
        },
        {
          headers: tokenHeader,
        }
      );

      setProperty((prev) =>
        prev
          ? {
              ...prev,
              rating_clean: res.data.averages.clean,
              rating_food: res.data.averages.food,
              rating_safety: res.data.averages.safety,
            }
          : prev
      );

      alert("Rating submitted!");
    } catch (err) {
      console.error(err);
      alert("Error submitting rating");
    } finally {
      setLoadingRating(false);
    }
  };

  const renderInteractiveStars = (currentValue, onChange) =>
    [...Array(5)].map((_, i) => {
      const value = i + 1;
      return (
        <span
          key={i}
          style={{
            cursor: "pointer",
            color: value <= currentValue ? "#667eea" : "#d1d5db",
            fontSize: "28px",
            marginRight: "8px",
            transition: "all 0.2s ease",
          }}
          onClick={() => onChange(value)}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          ★
        </span>
      );
    });

  if (!property) return <p>Loading...</p>;

  const totalRating =
    Math.round(
      ((property.rating_clean + property.rating_food + property.rating_safety) /
        3) *
        10
    ) / 10;

  const genderImg =
    property.gender === "male"
      ? "/img/male.png"
      : property.gender === "female"
      ? "/img/female.png"
      : "/img/unisex.png";

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ["/img/fallback.png"];

  const renderStars = (rating) =>
    [...Array(5)].map((_, i) => {
      if (rating >= i + 0.8)
        return (
          <FaStar
            key={i}
            style={{ color: "#fbbf24", fontSize: "14px", marginRight: "4px" }}
          />
        );
      if (rating >= i + 0.3)
        return (
          <FaStarHalfAlt
            key={i}
            style={{ color: "#fbbf24", fontSize: "14px", marginRight: "4px" }}
          />
        );
      return (
        <FaRegStar
          key={i}
          style={{ color: "#fbbf24", fontSize: "14px", marginRight: "4px" }}
        />
      );
    });

  const groupedAmenities = [
    "Building",
    "Common Area",
    "Bedroom",
    "Washroom",
  ].map((type) => ({
    type,
    items: amenities.filter((a) => a.type === type),
  }));

  const getImageUrl = (img) => {
    if (img.startsWith("/uploads")) {
      return `http://localhost:5000${img}`;
    }
    return img;
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

          * {
            font-family: 'Poppins', sans-serif;
          }

          .modern-breadcrumb-wrapper {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            padding: 15px 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          }

          .modern-breadcrumb-wrapper .breadcrumb {
            background: transparent;
            margin: 0;
            padding: 0;
          }

          .modern-breadcrumb-wrapper .breadcrumb-item a {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .modern-breadcrumb-wrapper .breadcrumb-item a:hover {
            color: #764ba2;
          }

          .modern-breadcrumb-wrapper .breadcrumb-item.active {
            color: #6b7280;
          }

          .modern-carousel {
            position: relative;
            max-height: 500px;
            overflow: hidden;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          }

          .modern-carousel img {
            height: 500px;
            object-fit: cover;
          }

          .modern-carousel .carousel-control-prev,
          .modern-carousel .carousel-control-next {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 50%;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: all 0.3s ease;
          }

          .modern-carousel:hover .carousel-control-prev,
          .modern-carousel:hover .carousel-control-next {
            opacity: 1;
          }

          .modern-carousel .carousel-control-prev {
            left: 20px;
          }

          .modern-carousel .carousel-control-next {
            right: 20px;
          }

          .modern-carousel .carousel-control-prev-icon,
          .modern-carousel .carousel-control-next-icon {
            filter: invert(1);
          }

          .property-detail-container {
            background: #f9fafb;
            padding: 60px 0;
          }

          .property-summary-card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin-bottom: 40px;
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

          .property-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f3f4f6;
          }

          .interest-button {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .interest-button:hover {
            transform: scale(1.1);
          }

          .interest-heart {
            font-size: 32px;
            transition: all 0.3s ease;
          }

          .interest-count {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #6b7280;
            font-size: 14px;
            font-weight: 500;
          }

          .property-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 12px;
          }

          .property-location {
            display: flex;
            align-items: center;
            gap: 10px;
            color: #6b7280;
            font-size: 16px;
            margin-bottom: 20px;
          }

          .property-location svg {
            color: #667eea;
          }

          .property-gender-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #f3f4f6;
            padding: 8px 16px;
            border-radius: 20px;
            margin-bottom: 25px;
          }

          .property-gender-badge img {
            width: 24px;
            height: 24px;
          }

          .property-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 25px;
            border-top: 2px solid #f3f4f6;
          }

          .rent-display {
            display: flex;
            flex-direction: column;
          }

          .rent-amount {
            font-size: 2.5rem;
            font-weight: 700;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .rent-period {
            color: #9ca3af;
            font-size: 14px;
            margin-top: -5px;
          }

          .book-now-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            padding: 15px 50px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
          }

          .book-now-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          }

          .section-card {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            margin-bottom: 40px;
          }

          .section-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 30px;
            position: relative;
            display: inline-block;
          }

          .section-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 0;
            width: 60px;
            height: 4px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
          }

          .amenities-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin-top: 40px;
          }

          .amenity-group {
            background: #f9fafb;
            padding: 25px;
            border-radius: 15px;
            transition: all 0.3s ease;
          }

          .amenity-group:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          }

          .amenity-group-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: #667eea;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .amenity-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 0;
            color: #4b5563;
            font-size: 14px;
          }

          .amenity-item img {
            width: 24px;
            height: 24px;
            filter: grayscale(1);
            transition: all 0.3s ease;
          }

          .amenity-group:hover .amenity-item img {
            filter: grayscale(0);
          }

          .rating-grid {
            display: grid;
            grid-template-columns: 1fr auto;
            gap: 40px;
            align-items: center;
          }

          .rating-criteria-list {
            display: flex;
            flex-direction: column;
            gap: 25px;
          }

          .rating-criteria-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: #f9fafb;
            border-radius: 12px;
            transition: all 0.3s ease;
          }

          .rating-criteria-item:hover {
            background: #f3f4f6;
            transform: translateX(5px);
          }

          .criteria-label {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 500;
            color: #374151;
          }

          .criteria-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
          }

          .rating-circle-container {
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          }

          .total-rating-number {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 10px;
          }

          .rating-circle-stars {
            display: flex;
            gap: 4px;
            font-size: 18px;
          }

          .user-rating-section {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            padding: 40px;
            border-radius: 20px;
            margin-bottom: 40px;
          }

          .user-rating-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 30px;
          }

          .rating-input-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: white;
            border-radius: 12px;
            margin-bottom: 15px;
          }

          .rating-input-label {
            font-weight: 600;
            color: #374151;
            font-size: 16px;
          }

          .submit-rating-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            padding: 15px 40px;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            margin-top: 20px;
            transition: all 0.3s ease;
          }

          .submit-rating-button:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
          }

          .submit-rating-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .testimonial-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 25px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            position: relative;
          }

          .testimonial-card::before {
            content: '"';
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 4rem;
            color: #667eea;
            opacity: 0.2;
            font-family: Georgia, serif;
          }

          .testimonial-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          }

          .testimonial-header {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 20px;
          }

          .testimonial-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: 3px solid #667eea;
          }

          .testimonial-content {
            color: #4b5563;
            line-height: 1.8;
            font-size: 15px;
            position: relative;
            z-index: 1;
          }

          .testimonial-author {
            font-weight: 600;
            color: #667eea;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #f3f4f6;
          }

          @media (max-width: 768px) {
            .modern-carousel img {
              height: 300px;
            }

            .rating-grid {
              grid-template-columns: 1fr;
            }

            .rating-circle-container {
              width: 150px;
              height: 150px;
              margin: 0 auto;
            }

            .total-rating-number {
              font-size: 2.5rem;
            }

            .property-title {
              font-size: 1.5rem;
            }

            .rent-amount {
              font-size: 2rem;
            }

            .book-now-button {
              padding: 12px 30px;
              font-size: 14px;
            }

            .rating-input-row {
              flex-direction: column;
              gap: 15px;
              text-align: center;
            }
          }
        `}
      </style>

      {/* Breadcrumb */}
      <div className="modern-breadcrumb-wrapper">
        <Container>
          <Breadcrumb>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
              Home
            </Breadcrumb.Item>
            <Breadcrumb.Item
              linkAs={Link}
              linkProps={{ to: `/property_list/${property.city.name}` }}
            >
              {property.city?.name}
            </Breadcrumb.Item>
            <Breadcrumb.Item active>{property.name}</Breadcrumb.Item>
          </Breadcrumb>
        </Container>
      </div>

      {/* Image Carousel */}
      <Carousel className="modern-carousel">
        {images.map((img, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={getImageUrl(img)}
              alt={`slide-${index}`}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Property Details */}
      <div className="property-detail-container">
        <Container>
          {/* Property Summary */}
          <div className="property-summary-card">
            <div className="property-header">
              <div>{renderStars(totalRating)}</div>
              <div className="interest-button" onClick={toggleInterest}>
                <FaHeart
                  className="interest-heart"
                  style={{
                    color: property.userInterested ? "#ef4444" : "#d1d5db",
                  }}
                />
                <div className="interest-count">
                  <FaUsers />
                  {property.interestedCount ?? 0} interested
                </div>
              </div>
            </div>

            <h1 className="property-title">{property.name}</h1>
            <div className="property-location">
              <FaMapMarkerAlt />
              {property.address}
            </div>
            <div className="property-gender-badge">
              <img src={genderImg} alt="gender" />
              <span style={{ textTransform: "capitalize" }}>
                {property.gender}
              </span>
            </div>

            <div className="property-footer">
              <div className="rent-display">
                <div className="rent-amount">
                  ₹ {property.rent.toLocaleString()}
                </div>
                <div className="rent-period">per month</div>
              </div>
              <Button className="book-now-button" onClick={() => navigate(`/booking/${property._id}`)}>
                Book Now
              </Button>
            </div>
          </div>

          {/* Amenities */}
          <div className="section-card">
            <h2 className="section-title">Amenities</h2>
            <div className="amenities-grid">
              {groupedAmenities.map((group) => (
                <div className="amenity-group" key={group.type}>
                  <div className="amenity-group-title">
                    <FaCheckCircle />
                    {group.type}
                  </div>
                  {group.items.map((a) => (
                    <div className="amenity-item" key={a._id}>
                      <img src={`/img/amenities/${a.icon}.svg`} alt={a.name} />
                      <span>{a.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* About Property */}
          <div className="section-card">
            <h2 className="section-title">About the Property</h2>
            <p
              style={{ color: "#4b5563", lineHeight: "1.8", fontSize: "15px" }}
            >
              This is a great property located in the heart of the city. It
              offers comfortable living with all essential amenities and a
              friendly environment. Perfect for individuals looking for a
              convenient and affordable place to stay.
            </p>
          </div>

          {/* Property Rating */}
          <div className="section-card">
            <h2 className="section-title">Property Rating</h2>
            <div className="rating-grid">
              <div className="rating-criteria-list">
                {["Cleanliness", "Food Quality", "Safety"].map((cat, idx) => {
                  const rating = [
                    property.rating_clean,
                    property.rating_food,
                    property.rating_safety,
                  ][idx];
                  const icon = [<FaBroom />, <FaUtensils />, <FaLock />][idx];
                  return (
                    <div className="rating-criteria-item" key={cat}>
                      <div className="criteria-label">
                        <div className="criteria-icon">{icon}</div>
                        <span>{cat}</span>
                      </div>
                      <div>
                        {[...Array(5)].map((_, i) => {
                          if (rating >= i + 0.8)
                            return (
                              <FaStar
                                key={i}
                                style={{ color: "#fbbf24", fontSize: 18 }}
                              />
                            );
                          if (rating >= i + 0.3)
                            return (
                              <FaStarHalfAlt
                                key={i}
                                style={{ color: "#fbbf24", fontSize: 18 }}
                              />
                            );
                          return (
                            <FaRegStar
                              key={i}
                              style={{ color: "#d1d5db", fontSize: 18 }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="rating-circle-container">
                <div className="total-rating-number">{totalRating}</div>
                <div className="rating-circle-stars">
                  {[...Array(5)].map((_, i) => {
                    if (totalRating >= i + 0.8) return <FaStar key={i} />;
                    if (totalRating >= i + 0.3)
                      return <FaStarHalfAlt key={i} />;
                    return <FaRegStar key={i} />;
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* User Rating Section */}
          <div className="user-rating-section">
            <h3 className="user-rating-title">Rate This Property</h3>
            <div className="rating-input-row">
              <span className="rating-input-label">Cleanliness:</span>
              <div>
                {renderInteractiveStars(userRating.clean, (val) =>
                  setUserRating((r) => ({ ...r, clean: val }))
                )}
              </div>
            </div>
            <div className="rating-input-row">
              <span className="rating-input-label">Food Quality:</span>
              <div>
                {renderInteractiveStars(userRating.food, (val) =>
                  setUserRating((r) => ({ ...r, food: val }))
                )}
              </div>
            </div>
            <div className="rating-input-row">
              <span className="rating-input-label">Safety:</span>
              <div>
                {renderInteractiveStars(userRating.safety, (val) =>
                  setUserRating((r) => ({ ...r, safety: val }))
                )}
              </div>
            </div>
            <Button
              className="submit-rating-button"
              onClick={handleRatingSubmit}
              disabled={loadingRating}
            >
              {loadingRating ? "Submitting..." : "Submit Rating"}
            </Button>
          </div>

          {/* Testimonials */}
          <div className="section-card">
            <h2 className="section-title">What People Say</h2>
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t._id}>
                <div className="testimonial-header">
                  <img
                    className="testimonial-avatar"
                    src="/img/man.png"
                    alt="user"
                  />
                </div>
                <p className="testimonial-content">{t.content}</p>
                <div className="testimonial-author">- {t.user_name}</div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
}
