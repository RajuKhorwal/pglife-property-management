// frontend/src/components/SignupModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaLock,
  FaUniversity,
} from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SignupModal({ show, onHide, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    password: "",
    college_name: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const API_BASE = "https://pglife-property-management-backend.onrender.com" || "http://localhost:5000";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/auth/pg_signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      login(
        {
          _id: data.user._id,
          full_name: data.user.full_name,
          email: data.user.email,
          phone: data.user.phone || "",
          college_name: data.user.college_name || "",
          isAdmin: data.user.isAdmin || false,
        },
        data.token
      );
      onHide();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Signup with PGLife</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaUser />
            </InputGroup.Text>
            <Form.Control
              type="text"
              name="full_name"
              placeholder="Full Name"
              maxLength="30"
              required
              value={formData.full_name}
              onChange={handleChange}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaPhoneAlt />
            </InputGroup.Text>
            <Form.Control
              type="tel"
              name="phone"
              placeholder="Phone Number"
              pattern="[0-9]{10}"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaEnvelope />
            </InputGroup.Text>
            <Form.Control
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaLock />
            </InputGroup.Text>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              minLength="6"
              required
              value={formData.password}
              onChange={handleChange}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaUniversity />
            </InputGroup.Text>
            <Form.Control
              type="text"
              name="college_name"
              placeholder="College Name"
              maxLength="150"
              required
              value={formData.college_name}
              onChange={handleChange}
            />
          </InputGroup>
          <Form.Group className="mb-3">
            <span>I'm a </span>
            <Form.Check
              inline
              type="radio"
              id="gender-male"
              label="Male"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
            />
            <Form.Check
              inline
              type="radio"
              id="gender-female"
              label="Female"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
            />
            <Form.Check
              inline
              type="radio"
              id="gender-other"
              label="Other"
              name="gender"
              value="other"
              checked={formData.gender === "other"}
              onChange={handleChange}
            />
          </Form.Group>
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <span>
          Already have an account?{" "}
          <Button
            variant="link"
            onClick={() => {
              onHide();
              onSwitchToLogin();
            }}
          >
            Login
          </Button>
        </span>
      </Modal.Footer>
    </Modal>
  );
}
