// frontend/src/components/Header.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaSignInAlt, FaSignOutAlt, FaTools } from "react-icons/fa";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AppContext } from "../context/AppContext";

export default function Header() {
  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  const { setShowLogin, setShowSignup } = useContext(AppContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

          .modern-header {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            font-family: 'Poppins', sans-serif;
            font-size: 14px;
            position: sticky;
            top: 0;
            z-index: 1000;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            transition: all 0.3s ease;
          }

          .modern-header:hover {
            box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
          }

          .modern-navbar {
            padding: 12px 0;
          }

          .brand-logo {
            height: 45px;
            transition: transform 0.3s ease;
          }

          .brand-logo:hover {
            transform: scale(1.05);
          }

          .nav-button {
            background: transparent;
            border: none;
            color: #4b5563;
            font-weight: 500;
            padding: 8px 20px;
            border-radius: 25px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            font-size: 14px;
            text-decoration: none;
          }

          .nav-button:hover {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }

          .nav-button svg {
            font-size: 16px;
          }

          .signup-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            padding: 10px 24px;
            border-radius: 25px;
            transition: all 0.3s ease;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
          }

          .signup-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
          }

          .login-button {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
            font-weight: 600;
            padding: 8px 24px;
            border-radius: 25px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
          }

          .login-button:hover {
            background: #667eea;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          }

          .user-greeting {
            font-weight: 600;
            color: #1f2937;
            margin-right: 16px;
            padding: 8px 16px;
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
          }

          .user-greeting::before {
            content: '👋';
            font-size: 18px;
          }

          .nav-divider {
            width: 2px;
            height: 24px;
            background: linear-gradient(180deg, transparent 0%, #d1d5db 50%, transparent 100%);
            margin: 0 12px;
          }

          .admin-badge {
            background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
          }

          .admin-badge:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
            color: white;
          }

          .dashboard-link {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
          }

          .dashboard-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
            color: white;
          }

          .logout-button {
            background: transparent;
            color: #ef4444;
            border: 2px solid #ef4444;
            font-weight: 600;
            padding: 8px 20px;
            border-radius: 25px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
          }

          .logout-button:hover {
            background: #ef4444;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
          }

          .navbar-toggler {
            border: 2px solid #667eea;
            border-radius: 8px;
            padding: 8px 12px;
            transition: all 0.3s ease;
          }

          .navbar-toggler:hover {
            background: #667eea;
            transform: scale(1.05);
          }

          .navbar-toggler:hover .navbar-toggler-icon {
            filter: brightness(0) invert(1);
          }

          .navbar-toggler:focus {
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
          }

          @media (max-width: 768px) {
            .modern-navbar {
              padding: 10px 0;
            }

            .brand-logo {
              height: 38px;
            }

            .nav-button,
            .login-button,
            .signup-button,
            .dashboard-link,
            .admin-badge,
            .logout-button {
              margin: 5px 0;
              width: 100%;
              justify-content: center;
            }

            .user-greeting {
              width: 100%;
              justify-content: center;
              margin: 10px 0;
            }

            .nav-divider {
              display: none;
            }
          }

          /* Smooth entrance animation */
          @keyframes slideDown {
            from {
              transform: translateY(-100%);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .modern-header {
            animation: slideDown 0.5s ease-out;
          }
        `}
      </style>

      <div className="modern-header">
        <nav className="navbar navbar-expand-md navbar-light modern-navbar container">
          <Link className="navbar-brand" to="/">
            <img src="/img/logo.png" alt="PG Life" className="brand-logo" />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#my-navbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse justify-content-end"
            id="my-navbar"
          >
            <ul className="navbar-nav align-items-center">
              {!user ? (
                <>
                  <li className="nav-item">
                    <button
                      className="signup-button"
                      onClick={() => setShowSignup(true)}
                    >
                      <FaUser /> Signup
                    </button>
                  </li>
                  <div className="nav-divider"></div>
                  <li className="nav-item">
                    <button
                      className="login-button"
                      onClick={() => setShowLogin(true)}
                    >
                      <FaSignInAlt /> Login
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <div className="user-greeting">
                    Hi, {user.full_name}
                  </div>
                  <li className="nav-item">
                    <Link className="dashboard-link" to="/dashboard">
                      <FaUser /> Dashboard
                    </Link>
                  </li>
                  <div className="nav-divider"></div>
                  {user.isAdmin && (
                    <>
                      <li className="nav-item">
                        <Link className="admin-badge" to="/admin">
                          <FaTools /> Admin Panel
                        </Link>
                      </li>
                      <div className="nav-divider"></div>
                    </>
                  )}
                  <li className="nav-item">
                    <button
                      className="logout-button"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}