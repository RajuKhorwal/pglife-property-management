// frontend/src/components/LoginModal.jsx
import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { FaUser, FaLock } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LoginModal({ show, onHide, onSwitchToSignup }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      const res = await fetch(`${API_BASE}/api/auth/pg_login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      login(
        {
          _id: data.user._id,
          full_name: data.user.full_name,
          email: data.user.email,
          phone: data.user.phone || "",
          college_name: data.user.college_name || "",
          isAdmin: data.user.isAdmin || false,
          avatar_url: data.user.avatar_url || null,
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
        <Modal.Title>Login with PGLife</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <InputGroup className="mb-3">
            <InputGroup.Text>
              <FaUser />
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
          <Button type="submit" className="w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <span>
          Don't have an account?{" "}
          <Button
            variant="link"
            onClick={() => {
              onHide();
              onSwitchToSignup();
            }}
          >
            Signup here
          </Button>
        </span>
      </Modal.Footer>
    </Modal>
  );
}
