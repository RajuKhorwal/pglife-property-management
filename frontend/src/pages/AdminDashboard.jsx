// frontend/src/pages/AdminDashboard.jsx
import React, { useState } from "react";
import { Container, Row, Col, Nav } from "react-bootstrap";
import { FaHome, FaTools, FaUsers, FaClipboardList, FaBuilding, FaChartLine, FaSignOutAlt } from "react-icons/fa";

// Import new admin section components
import AdminProperties from "./admin/AdminProperties";
import AdminAmenities from "./admin/AdminAmenities";
import AdminUsers from "./admin/AdminUsers";
import AdminBookings from "./admin/AdminBookings";
import AdminTestimonials from "./admin/AdminTestimonials";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("properties");

  const renderContent = () => {
    switch (activeTab) {
      case "properties":
        return <AdminProperties />;
      case "amenities":
        return <AdminAmenities />;
      case "testimonials":
        return <AdminTestimonials />;
      case "users":
        return <AdminUsers />;
      case "bookings":
        return <AdminBookings />;
      default:
        return <h3>Welcome to Admin Dashboard</h3>;
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

          * {
            font-family: 'Poppins', sans-serif;
          }

          .admin-dashboard {
            background: #f9fafb;
            min-height: 100vh;
          }

          .admin-sidebar {
            background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
            min-height: 100vh;
            padding: 30px 20px;
            box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
            position: sticky;
            top: 0;
          }

          .admin-logo {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 2px solid rgba(255, 255, 255, 0.1);
          }

          .admin-logo-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          }

          .admin-logo-text {
            color: white;
            font-size: 1.5rem;
            font-weight: 700;
          }

          .admin-nav {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }

          .admin-nav-link {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            border-radius: 12px;
            color: rgba(255, 255, 255, 0.7);
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 500;
            font-size: 15px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }

          .admin-nav-link::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
            transform: scaleY(0);
            transition: transform 0.3s ease;
          }

          .admin-nav-link:hover {
            background: rgba(102, 126, 234, 0.1);
            color: white;
            transform: translateX(5px);
          }

          .admin-nav-link:hover::before {
            transform: scaleY(1);
          }

          .admin-nav-link.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }

          .admin-nav-link.active::before {
            display: none;
          }

          .admin-nav-icon {
            font-size: 18px;
            flex-shrink: 0;
          }

          .admin-nav-badge {
            margin-left: auto;
            background: rgba(239, 68, 68, 0.9);
            color: white;
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 600;
          }

          .admin-content {
            padding: 40px;
            background: #f9fafb;
            min-height: 100vh;
          }

          .admin-content-header {
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .admin-content-title {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 15px;
          }

          .admin-content-title-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 22px;
          }

          .admin-stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
          }

          .admin-stat-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .admin-stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--gradient);
          }

          .admin-stat-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          }

          .admin-stat-label {
            color: #6b7280;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 8px;
          }

          .admin-stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
          }

          .sidebar-footer {
            position: absolute;
            bottom: 30px;
            left: 20px;
            right: 20px;
            padding-top: 20px;
            border-top: 2px solid rgba(255, 255, 255, 0.1);
          }

          .sidebar-user {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            color: white;
            margin-bottom: 10px;
          }

          .sidebar-user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
          }

          .sidebar-user-info {
            flex: 1;
          }

          .sidebar-user-name {
            font-weight: 600;
            font-size: 14px;
          }

          .sidebar-user-role {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
          }

          @media (max-width: 768px) {
            .admin-sidebar {
              min-height: auto;
              padding: 20px 15px;
            }

            .admin-content {
              padding: 20px;
            }

            .admin-content-title {
              font-size: 1.5rem;
            }

            .sidebar-footer {
              position: static;
              margin-top: 30px;
            }
          }
        `}
      </style>

      <Container fluid className="admin-dashboard">
        <Row>
          {/* Sidebar */}
          <Col md={3} lg={2} className="admin-sidebar px-0">
            <div className="admin-logo">
              <div className="admin-logo-icon">
                <FaTools />
              </div>
              <div className="admin-logo-text">Admin</div>
            </div>

            <Nav className="admin-nav">
              <div
                className={`admin-nav-link ${activeTab === "properties" ? "active" : ""}`}
                onClick={() => setActiveTab("properties")}
              >
                <FaBuilding className="admin-nav-icon" />
                <span>Properties</span>
              </div>

              <div
                className={`admin-nav-link ${activeTab === "amenities" ? "active" : ""}`}
                onClick={() => setActiveTab("amenities")}
              >
                <FaTools className="admin-nav-icon" />
                <span>Amenities</span>
              </div>

              <div
                className={`admin-nav-link ${activeTab === "testimonials" ? "active" : ""}`}
                onClick={() => setActiveTab("testimonials")}
              >
                <span className="admin-nav-icon">💬</span>
                <span>Testimonials</span>
              </div>

              <div
                className={`admin-nav-link ${activeTab === "users" ? "active" : ""}`}
                onClick={() => setActiveTab("users")}
              >
                <FaUsers className="admin-nav-icon" />
                <span>Users</span>
              </div>

              <div
                className={`admin-nav-link ${activeTab === "bookings" ? "active" : ""}`}
                onClick={() => setActiveTab("bookings")}
              >
                <FaClipboardList className="admin-nav-icon" />
                <span>Bookings</span>
                <span className="admin-nav-badge">3</span>
              </div>
            </Nav>

            <div className="sidebar-footer">
              <div className="sidebar-user">
                <div className="sidebar-user-avatar">A</div>
                <div className="sidebar-user-info">
                  <div className="sidebar-user-name">Admin</div>
                  <div className="sidebar-user-role">Administrator</div>
                </div>
              </div>
            </div>
          </Col>

          {/* Main Content */}
          <Col md={9} lg={10} className="admin-content">
            <div className="admin-content-header">
              <h1 className="admin-content-title">
                <div className="admin-content-title-icon">
                  {activeTab === "properties" && <FaBuilding />}
                  {activeTab === "amenities" && <FaTools />}
                  {activeTab === "testimonials" && "💬"}
                  {activeTab === "users" && <FaUsers />}
                  {activeTab === "bookings" && <FaClipboardList />}
                </div>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h1>
            </div>

            {/* Quick Stats (optional - can be shown for specific tabs) */}
            {activeTab === "properties" && (
              <div className="admin-stats-grid">
                <div className="admin-stat-card" style={{ '--gradient': 'linear-gradient(90deg, #667eea, #764ba2)' }}>
                  <div className="admin-stat-label">Total Properties</div>
                  <div className="admin-stat-value">24</div>
                </div>
                <div className="admin-stat-card" style={{ '--gradient': 'linear-gradient(90deg, #f093fb, #f5576c)' }}>
                  <div className="admin-stat-label">Active Listings</div>
                  <div className="admin-stat-value">18</div>
                </div>
                <div className="admin-stat-card" style={{ '--gradient': 'linear-gradient(90deg, #4facfe, #00f2fe)' }}>
                  <div className="admin-stat-label">Total Views</div>
                  <div className="admin-stat-value">1,234</div>
                </div>
                <div className="admin-stat-card" style={{ '--gradient': 'linear-gradient(90deg, #43e97b, #38f9d7)' }}>
                  <div className="admin-stat-label">Interested Users</div>
                  <div className="admin-stat-value">456</div>
                </div>
              </div>
            )}

            {/* Render Active Component */}
            <div>
              {renderContent()}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}