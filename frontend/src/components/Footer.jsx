// frontend/src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  const cities = [
    { name: "Delhi", cityParam: "delhi" },
    { name: "Mumbai", cityParam: "mumbai" },
    { name: "Bangalore", cityParam: "bangalore" },
    { name: "Hyderabad", cityParam: "hyderabad" },
  ];

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

          .modern-footer {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            color: #e5e7eb;
            font-family: 'Poppins', sans-serif;
            padding: 60px 0 0;
            margin-top: 80px;
            position: relative;
            overflow: hidden;
          }

          .modern-footer::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%);
            background-size: 200% 100%;
            animation: gradient-shift 3s ease infinite;
          }

          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }

          .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
          }

          .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            margin-bottom: 40px;
          }

          .footer-section h3 {
            color: white;
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 20px;
            position: relative;
            display: inline-block;
          }

          .footer-section h3::after {
            content: '';
            position: absolute;
            bottom: -8px;
            left: 0;
            width: 40px;
            height: 3px;
            background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
            border-radius: 2px;
          }

          .footer-logo {
            height: 50px;
            margin-bottom: 20px;
            transition: transform 0.3s ease;
          }

          .footer-logo:hover {
            transform: scale(1.05);
          }

          .footer-description {
            color: #9ca3af;
            line-height: 1.6;
            margin-bottom: 20px;
            font-size: 14px;
          }

          .footer-cities {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          .footer-city-link {
            color: #9ca3af;
            text-decoration: none;
            transition: all 0.3s ease;
            padding: 8px 12px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
          }

          .footer-city-link:hover {
            color: white;
            background: rgba(102, 126, 234, 0.2);
            transform: translateX(5px);
          }

          .footer-city-link svg {
            color: #667eea;
            font-size: 12px;
          }

          .contact-info {
            display: flex;
            flex-direction: column;
            gap: 15px;
          }

          .contact-item {
            display: flex;
            align-items: center;
            gap: 12px;
            color: #9ca3af;
            font-size: 14px;
            transition: all 0.3s ease;
          }

          .contact-item:hover {
            color: white;
            transform: translateX(5px);
          }

          .contact-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            flex-shrink: 0;
          }

          .social-links {
            display: flex;
            gap: 15px;
            margin-top: 20px;
          }

          .social-link {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: rgba(102, 126, 234, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #667eea;
            transition: all 0.3s ease;
            text-decoration: none;
          }

          .social-link:hover {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            transform: translateY(-5px) rotate(360deg);
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          }

          .footer-bottom {
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            padding: 25px 0;
            text-align: center;
            background: rgba(0, 0, 0, 0.2);
          }

          .copyright {
            color: #9ca3af;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .copyright .heart {
            color: #ef4444;
            animation: heartbeat 1.5s ease-in-out infinite;
          }

          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.2); }
            50% { transform: scale(1); }
          }

          .footer-links {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-top: 15px;
            flex-wrap: wrap;
          }

          .footer-link {
            color: #9ca3af;
            text-decoration: none;
            font-size: 13px;
            transition: all 0.3s ease;
          }

          .footer-link:hover {
            color: #667eea;
          }

          @media (max-width: 768px) {
            .modern-footer {
              padding: 40px 0 0;
              margin-top: 60px;
            }

            .footer-content {
              grid-template-columns: 1fr;
              gap: 30px;
            }

            .footer-cities {
              grid-template-columns: 1fr;
            }

            .social-links {
              justify-content: center;
            }

            .footer-section h3 {
              font-size: 1.1rem;
            }
          }
        `}
      </style>

      <footer className="modern-footer">
        <div className="footer-container">
          <div className="footer-content">
            {/* About Section */}
            <div className="footer-section">
              <img src="/img/logo.png" alt="PG Life" className="footer-logo" />
              <p className="footer-description">
                Find your perfect home away from home. We offer verified PG accommodations 
                in major cities across India with the best amenities and locations.
              </p>
              <div className="social-links">
                <a href="/" className="social-link" aria-label="Facebook">
                  <FaFacebookF />
                </a>
                <a href="/" className="social-link" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="/" className="social-link" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="/" className="social-link" aria-label="LinkedIn">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

            {/* Cities Section */}
            <div className="footer-section">
              <h3>Popular Cities</h3>
              <div className="footer-cities">
                {cities.map((city) => (
                  <Link
                    key={city.cityParam}
                    to={`/property_list/${city.cityParam}`}
                    className="footer-city-link"
                  >
                    <FaMapMarkerAlt />
                    PG in {city.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="footer-section">
              <h3>Contact Us</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaMapMarkerAlt />
                  </div>
                  <span>123 PG Street, Mumbai, India</span>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaEnvelope />
                  </div>
                  <span>support@pglife.com</span>
                </div>
                <div className="contact-item">
                  <div className="contact-icon">
                    <FaPhone />
                  </div>
                  <span>+91 98765 43210</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="copyright">
              © {new Date().getFullYear()} PG Life. Made with 
              <span className="heart">❤</span> in India
            </div>
            <div className="footer-links">
              <a href="/" className="footer-link">Privacy Policy</a>
              <a href="/" className="footer-link">Terms of Service</a>
              <a href="/" className="footer-link">Support</a>
              <a href="/" className="footer-link">FAQ</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;