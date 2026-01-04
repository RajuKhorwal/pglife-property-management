// frontend/src/pages/admin/AdminTestimonials.jsx
import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Modal, Form, Spinner, Badge } from "react-bootstrap";
import { FaComments, FaEdit, FaTrash, FaPlus, FaCheckCircle, FaTimesCircle, FaClock, FaUser, FaBuilding, FaQuoteLeft } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function AdminTestimonials() {
  const { tokenHeader } = useContext(AuthContext);

  const [testimonials, setTestimonials] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    content: "",
    status: "pending",
  });

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    propertyId: "",
    user_name: "",
    content: "",
  });

  const [selected, setSelected] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tRes, pRes] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/testimonials`, { headers: tokenHeader }),
        axios.get(`${API_BASE}/api/admin/properties`, { headers: tokenHeader }),
      ]);
      setTestimonials(tRes.data.testimonials || []);
      setProperties(pRes.data.properties || []);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load testimonials ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tokenHeader]);

  useEffect(() => {
    if (selected) {
      setEditData({
        content: selected.content,
        status: selected.status,
      });
      setEditing(false);
    }
  }, [selected]);

  const updateStatus = async (id, status) => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/admin/testimonials/${id}`,
        { status },
        { headers: tokenHeader }
      );
      setTestimonials((prev) =>
        prev.map((t) => (t._id === id ? res.data.testimonial : t))
      );
      toast.success(`Testimonial ${status} ✅`);
    } catch (err) {
      console.error("Status update error:", err);
      toast.error("Failed to update status ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await axios.delete(`${API_BASE}/api/admin/testimonials/${id}`, {
        headers: tokenHeader,
      });
      setTestimonials((prev) => prev.filter((t) => t._id !== id));
      toast.success("Testimonial deleted ✅");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete ❌");
    }
  };

  const handleSubmit = async () => {
    const { propertyId, user_name, content } = formData;
    if (!propertyId || !content || !user_name) {
      toast.error("All fields required ❌");
      return;
    }
    try {
      const res = await axios.post(
        `${API_BASE}/api/admin/properties/${propertyId}/testimonials`,
        { user_name, content },
        { headers: tokenHeader }
      );
      setTestimonials([res.data.testimonial, ...testimonials]);
      toast.success("Testimonial added ✅");
      setShowForm(false);
      setFormData({ propertyId: "", user_name: "", content: "" });
    } catch (err) {
      console.error("Add testimonial error:", err);
      toast.error("Failed to add testimonial ❌");
    }
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `${API_BASE}/api/admin/testimonials/${selected._id}`,
        editData,
        { headers: tokenHeader }
      );
      setTestimonials((prev) =>
        prev.map((t) => (t._id === selected._id ? res.data.testimonial : t))
      );
      setSelected(res.data.testimonial);
      setEditing(false);
      toast.success("Testimonial updated ✅");
    } catch (err) {
      console.error("Update testimonial error:", err);
      toast.error("Failed to update testimonial ❌");
    }
  };

  const getStatusBadge = (status) => {
    const configs = {
      approved: { bg: '#10b981', icon: <FaCheckCircle /> },
      rejected: { bg: '#ef4444', icon: <FaTimesCircle /> },
      pending: { bg: '#f59e0b', icon: <FaClock /> },
    };
    return configs[status] || configs.pending;
  };

  const filtered = filter === "all" ? testimonials : testimonials.filter((t) => t.status === filter);

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" style={{ color: "#667eea" }} />
        <p style={{ marginTop: "15px", color: "#6b7280" }}>Loading testimonials...</p>
      </div>
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

          .testimonials-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 15px;
          }

          .testimonials-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 0;
          }

          .testimonials-controls {
            display: flex;
            gap: 12px;
            align-items: center;
          }

          .filter-buttons {
            display: flex;
            gap: 8px;
            background: white;
            padding: 6px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
          }

          .filter-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            font-size: 13px;
            background: transparent;
            color: #6b7280;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .filter-btn:hover {
            background: #f3f4f6;
          }

          .filter-btn.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }

          .add-button {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            padding: 10px 24px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 14px;
            color: white;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
            white-space: nowrap;
          }

          .add-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          }

          .testimonials-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
          }

          .stat-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
            position: relative;
            overflow: hidden;
          }

          .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--gradient);
          }

          .stat-label {
            font-size: 12px;
            color: #9ca3af;
            font-weight: 500;
            margin-bottom: 8px;
          }

          .stat-value {
            font-size: 2rem;
            font-weight: 700;
            color: #1f2937;
          }

          .testimonials-table-container {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          }

          .modern-table {
            margin-bottom: 0;
          }

          .modern-table thead {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .modern-table thead th {
            color: white;
            font-weight: 600;
            padding: 18px 20px;
            border: none;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .modern-table tbody tr {
            cursor: pointer;
            transition: all 0.3s ease;
            border-bottom: 1px solid #f3f4f6;
          }

          .modern-table tbody tr:hover {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
            transform: scale(1.01);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }

          .modern-table tbody td {
            padding: 18px 20px;
            vertical-align: middle;
            color: #4b5563;
            font-size: 14px;
          }

          .user-info {
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #667eea;
          }

          .user-avatar-placeholder {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
          }

          .content-preview {
            max-width: 300px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            padding-left: 20px;
          }

          .content-preview::before {
            content: '"';
            position: absolute;
            left: 0;
            font-size: 1.5rem;
            color: #667eea;
            opacity: 0.5;
          }

          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            color: white;
          }

          .action-buttons {
            display: flex;
            gap: 8px;
          }

          .action-btn {
            padding: 8px 16px;
            border-radius: 8px;
            border: none;
            font-weight: 500;
            font-size: 13px;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
          }

          .action-btn.approve {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }

          .action-btn.approve:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          }

          .action-btn.reject {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
          }

          .action-btn.reject:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          }

          /* Modal Styles */
          .testimonial-modal .modal-content {
            border: none;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .testimonial-modal .modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 25px 30px;
          }

          .testimonial-modal .modal-title {
            font-weight: 700;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .testimonial-modal .btn-close {
            filter: brightness(0) invert(1);
            opacity: 1;
          }

          .testimonial-modal .modal-body {
            padding: 30px;
          }

          .testimonial-modal .form-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            font-size: 14px;
          }

          .testimonial-modal .form-control,
          .testimonial-modal .form-select {
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            padding: 12px 16px;
            transition: all 0.3s ease;
            font-size: 14px;
          }

          .testimonial-modal textarea.form-control {
            min-height: 120px;
            line-height: 1.6;
          }

          .testimonial-modal .form-control:focus,
          .testimonial-modal .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          }

          .testimonial-modal .modal-footer {
            border: none;
            padding: 20px 30px;
            background: #f9fafb;
          }

          .testimonial-modal .btn-secondary {
            background: #6b7280;
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
          }

          .testimonial-modal .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
          }

          .testimonial-modal .btn-warning {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
            color: white;
          }

          .testimonial-modal .btn-primary:hover,
          .testimonial-modal .btn-warning:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }

          .detail-section {
            background: #f9fafb;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 15px;
          }

          .detail-item {
            display: flex;
            gap: 15px;
            margin-bottom: 15px;
            align-items: flex-start;
          }

          .detail-item:last-child {
            margin-bottom: 0;
          }

          .detail-icon {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 16px;
            flex-shrink: 0;
          }

          .detail-content {
            flex: 1;
          }

          .detail-label {
            font-size: 12px;
            color: #9ca3af;
            font-weight: 500;
            margin-bottom: 4px;
          }

          .detail-value {
            font-size: 15px;
            color: #1f2937;
            font-weight: 500;
          }

          .testimonial-text {
            background: white;
            padding: 20px;
            border-radius: 12px;
            border-left: 4px solid #667eea;
            font-style: italic;
            line-height: 1.8;
            position: relative;
          }

          .testimonial-text::before {
            content: '"';
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 3rem;
            color: #667eea;
            opacity: 0.2;
          }

          .no-data {
            text-align: center;
            padding: 60px 20px;
            color: #9ca3af;
          }

          @media (max-width: 768px) {
            .testimonials-header {
              flex-direction: column;
              align-items: stretch;
            }

            .testimonials-controls {
              flex-direction: column;
            }

            .filter-buttons {
              justify-content: center;
              flex-wrap: wrap;
            }

            .add-button {
              width: 100%;
              justify-content: center;
            }

            .action-buttons {
              flex-direction: column;
            }

            .action-btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}
      </style>

      <div>
        <div className="testimonials-header">
          <h3 className="testimonials-title">
            <FaComments /> Manage Testimonials
          </h3>
          <div className="testimonials-controls">
            <div className="filter-buttons">
              {[
                { value: 'all', label: 'All' },
                { value: 'pending', label: 'Pending', icon: <FaClock /> },
                { value: 'approved', label: 'Approved', icon: <FaCheckCircle /> },
                { value: 'rejected', label: 'Rejected', icon: <FaTimesCircle /> }
              ].map(f => (
                <button
                  key={f.value}
                  className={`filter-btn ${filter === f.value ? 'active' : ''}`}
                  onClick={() => setFilter(f.value)}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
            </div>
            <button className="add-button" onClick={() => setShowForm(true)}>
              <FaPlus /> Add Testimonial
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="testimonials-stats">
          <div className="stat-card" style={{ '--gradient': 'linear-gradient(90deg, #667eea, #764ba2)' }}>
            <div className="stat-label">Total</div>
            <div className="stat-value">{testimonials.length}</div>
          </div>
          <div className="stat-card" style={{ '--gradient': 'linear-gradient(90deg, #f59e0b, #d97706)' }}>
            <div className="stat-label">Pending</div>
            <div className="stat-value">{testimonials.filter(t => t.status === 'pending').length}</div>
          </div>
          <div className="stat-card" style={{ '--gradient': 'linear-gradient(90deg, #10b981, #059669)' }}>
            <div className="stat-label">Approved</div>
            <div className="stat-value">{testimonials.filter(t => t.status === 'approved').length}</div>
          </div>
          <div className="stat-card" style={{ '--gradient': 'linear-gradient(90deg, #ef4444, #dc2626)' }}>
            <div className="stat-label">Rejected</div>
            <div className="stat-value">{testimonials.filter(t => t.status === 'rejected').length}</div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="no-data">
            <FaComments style={{ fontSize: '4rem', opacity: 0.3, marginBottom: '15px' }} />
            <h4>No testimonials found</h4>
            <p>{filter !== "all" ? `No ${filter} testimonials available` : "Start by adding your first testimonial"}</p>
          </div>
        ) : (
          <div className="testimonials-table-container">
            <Table className="modern-table" hover>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>User</th>
                  <th>Content</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t._id} onClick={() => setSelected(t)}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaBuilding style={{ color: '#667eea' }} />
                        {t.property?.name || "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="user-info">
                        {t.user?.avatar_url ? (
                          <img
                            src={`${API_BASE}${t.user.avatar_url}`}
                            alt="avatar"
                            className="user-avatar"
                          />
                        ) : (
                          <div className="user-avatar-placeholder">
                            {(t.user?.full_name || t.user_name || "U").charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span>{t.user?.full_name || t.user_name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="content-preview">
                        {t.content.slice(0, 50)}...
                      </div>
                    </td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ background: getStatusBadge(t.status).bg }}
                      >
                        {getStatusBadge(t.status).icon}
                        {t.status}
                      </span>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="action-buttons">
                        <button
                          className="action-btn approve"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(t._id, "approved");
                          }}
                        >
                          <FaCheckCircle /> Approve
                        </button>
                        <button
                          className="action-btn reject"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("Reject and delete this testimonial?")) {
                              handleDelete(t._id);
                            }
                          }}
                        >
                          <FaTrash /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Add Form Modal */}
        <Modal
          show={showForm}
          onHide={() => setShowForm(false)}
          centered
          className="testimonial-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaPlus /> Add New Testimonial
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Property</Form.Label>
                <Form.Select
                  value={formData.propertyId}
                  onChange={(e) =>
                    setFormData({ ...formData, propertyId: e.target.value })
                  }
                >
                  <option value="">-- Select Property --</option>
                  {properties.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  value={formData.user_name}
                  onChange={(e) =>
                    setFormData({ ...formData, user_name: e.target.value })
                  }
                  placeholder="Enter user name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Testimonial Content</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Enter testimonial content..."
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Add Testimonial
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Details Modal */}
        {selected && (
          <Modal
            show={true}
            onHide={() => setSelected(null)}
            centered
            className="testimonial-modal"
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <FaQuoteLeft /> Testimonial Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {editing ? (
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>Content</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={editData.content}
                      onChange={(e) =>
                        setEditData({ ...editData, content: e.target.value })
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({ ...editData, status: e.target.value })
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </Form.Select>
                  </Form.Group>
                </Form>
              ) : (
                <div>
                  <div className="detail-section">
                    <div className="detail-item">
                      <div className="detail-icon"><FaBuilding /></div>
                      <div className="detail-content">
                        <div className="detail-label">Property</div>
                        <div className="detail-value">{selected.property?.name || "N/A"}</div>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon"><FaUser /></div>
                      <div className="detail-content">
                        <div className="detail-label">User</div>
                        <div className="detail-value">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {selected.user?.avatar_url && (
                              <img
                                src={`${API_BASE}${selected.user.avatar_url}`}
                                alt="avatar"
                                className="user-avatar"
                              />
                            )}
                            <div>
                              <div>{selected.user?.full_name || selected.user_name}</div>
                              {selected.user?.email && (
                                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                                  {selected.user.email}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-icon">
                        {getStatusBadge(selected.status).icon}
                      </div>
                      <div className="detail-content">
                        <div className="detail-label">Status</div>
                        <div className="detail-value" style={{ textTransform:
                        // Continuation of AdminTestimonials.jsx - Replace from line with "textTransform:"

                        'capitalize' }}>{selected.status}</div>
                      </div>
                    </div>
                  </div>

                  <div className="detail-section">
                    <div className="detail-label" style={{ marginBottom: '12px' }}>
                      <FaQuoteLeft style={{ marginRight: '8px', color: '#667eea' }} />
                      Testimonial Content
                    </div>
                    <div className="testimonial-text">
                      {selected.content}
                    </div>
                  </div>

                  <div className="detail-section">
                    <div className="detail-item">
                      <div className="detail-icon">📅</div>
                      <div className="detail-content">
                        <div className="detail-label">Created At</div>
                        <div className="detail-value">
                          {new Date(selected.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Close
              </Button>
              {editing ? (
                <Button variant="primary" onClick={handleSaveEdit}>
                  <FaCheckCircle /> Save Changes
                </Button>
              ) : (
                <Button
                  variant="warning"
                  onClick={() => {
                    setEditData({
                      content: selected.content,
                      status: selected.status,
                    });
                    setEditing(true);
                  }}
                >
                  <FaEdit /> Edit Testimonial
                </Button>
              )}
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
}