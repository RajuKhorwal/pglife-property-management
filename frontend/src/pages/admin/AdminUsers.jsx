// frontend/src/pages/admin/AdminUsers.jsx
import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Modal, Form, Spinner, Badge } from "react-bootstrap";
import { FaEdit, FaTrash, FaUser, FaEnvelope, FaPhone, FaUniversity, FaVenusMars, FaUserShield } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";

const API_BASE = "http://localhost:5000/api/admin";

export default function AdminUsers() {
  const { tokenHeader } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    college_name: "",
    gender: "",
    avatar_url: "",
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/users`, { headers: tokenHeader });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [tokenHeader]);

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API_BASE}/users/${userId}`, { headers: tokenHeader });
      setUsers(users.filter((u) => u._id !== userId));
      toast.success("User deleted ✅");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user ❌");
    }
  };

  // Open edit modal
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name,
      phone: user.phone,
      college_name: user.college_name,
      gender: user.gender,
      avatar_url: user.avatar_url || "",
    });
    setShowModal(true);
  };

  // Submit edit
  const handleSubmit = async () => {
    const { full_name, phone, college_name, gender, avatar_url } = formData;
    if (!full_name || !phone || !college_name || !gender) {
      toast.error("All fields are required ❌");
      return;
    }
    try {
      const res = await axios.put(
        `${API_BASE}/users/${editingUser._id}`,
        { full_name, phone, college_name, gender, avatar_url },
        { headers: tokenHeader }
      );
      setUsers(users.map((u) => (u._id === editingUser._id ? res.data.user : u)));
      toast.success("User updated ✅");
      setShowModal(false);
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update user ❌");
    }
  };

  // Click row to view (read-only)
  const handleRowClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setEditingUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" style={{ color: "#667eea" }} />
        <p style={{ marginTop: "15px", color: "#6b7280" }}>Loading users...</p>
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

          .users-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }

          .users-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 0;
          }

          .users-count-badge {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
          }

          .users-table-container {
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
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 16px;
            flex-shrink: 0;
          }

          .user-avatar img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }

          .user-details {
            display: flex;
            flex-direction: column;
          }

          .user-name {
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 2px;
          }

          .user-email {
            font-size: 12px;
            color: #9ca3af;
          }

          .admin-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
          }

          .admin-badge.yes {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
          }

          .admin-badge.no {
            background: #f3f4f6;
            color: #6b7280;
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
          }

          .action-btn.edit {
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            color: white;
          }

          .action-btn.edit:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
          }

          .action-btn.delete {
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            color: white;
          }

          .action-btn.delete:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          }

          /* Modal Styles */
          .user-modal .modal-content {
            border: none;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .user-modal .modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 25px 30px;
          }

          .user-modal .modal-title {
            font-weight: 700;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .user-modal .btn-close {
            filter: brightness(0) invert(1);
            opacity: 1;
          }

          .user-modal .modal-body {
            padding: 30px;
          }

          .detail-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: #f9fafb;
            border-radius: 10px;
            margin-bottom: 15px;
          }

          .detail-icon {
            width: 45px;
            height: 45px;
            border-radius: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 18px;
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
            font-weight: 600;
          }

          .user-modal .form-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            font-size: 14px;
          }

          .user-modal .form-control,
          .user-modal .form-select {
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            padding: 12px 16px;
            transition: all 0.3s ease;
            font-size: 14px;
          }

          .user-modal .form-control:focus,
          .user-modal .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          }

          .user-modal .modal-footer {
            border: none;
            padding: 20px 30px;
            background: #f9fafb;
          }

          .user-modal .btn-secondary {
            background: #6b7280;
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
          }

          .user-modal .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
          }

          .user-modal .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }

          .user-avatar-preview {
            text-align: center;
            margin-bottom: 20px;
          }

          .user-avatar-preview img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #667eea;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          @media (max-width: 768px) {
            .users-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 15px;
            }

            .action-buttons {
              flex-direction: column;
              width: 100%;
            }

            .action-btn {
              width: 100%;
              justify-content: center;
            }

            .modern-table {
              font-size: 13px;
            }
          }
        `}
      </style>

      <div>
        <div className="users-header">
          <h3 className="users-title">
            <FaUser /> Manage Users
          </h3>
          <span className="users-count-badge">{users.length} Total Users</span>
        </div>

        <div className="users-table-container">
          <Table className="modern-table" hover>
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Admin Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u._id}
                  onClick={(e) => {
                    if (e.target.tagName !== "BUTTON" && !e.target.closest('.action-btn')) {
                      handleRowClick(u);
                    }
                  }}
                >
                  <td>{idx + 1}</td>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt={u.full_name} />
                        ) : (
                          u.full_name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div className="user-details">
                        <div className="user-name">{u.full_name}</div>
                        <div className="user-email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${u.isAdmin ? 'yes' : 'no'}`}>
                      {u.isAdmin && <FaUserShield />}
                      {u.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(u);
                        }}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        className="action-btn delete" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(u._id);
                        }}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Modal */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          centered
          className="user-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaUser />
              {editingUser ? "Edit User" : "User Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {editingUser ? (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>College</Form.Label>
                  <Form.Control
                    value={formData.college_name}
                    onChange={(e) => setFormData({ ...formData, college_name: e.target.value })}
                    placeholder="Enter college name"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Avatar URL</Form.Label>
                  <Form.Control
                    value={formData.avatar_url}
                    onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                    placeholder="Enter avatar URL"
                  />
                </Form.Group>
              </Form>
            ) : selectedUser ? (
              <div>
                {selectedUser.avatar_url && (
                  <div className="user-avatar-preview">
                    <img src={selectedUser.avatar_url} alt={selectedUser.full_name} />
                  </div>
                )}
                
                <div className="detail-item">
                  <div className="detail-icon"><FaUser /></div>
                  <div className="detail-content">
                    <div className="detail-label">Full Name</div>
                    <div className="detail-value">{selectedUser.full_name}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon"><FaEnvelope /></div>
                  <div className="detail-content">
                    <div className="detail-label">Email</div>
                    <div className="detail-value">{selectedUser.email}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon"><FaPhone /></div>
                  <div className="detail-content">
                    <div className="detail-label">Phone</div>
                    <div className="detail-value">{selectedUser.phone || "Not provided"}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon"><FaUniversity /></div>
                  <div className="detail-content">
                    <div className="detail-label">College</div>
                    <div className="detail-value">{selectedUser.college_name || "Not provided"}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon"><FaVenusMars /></div>
                  <div className="detail-content">
                    <div className="detail-label">Gender</div>
                    <div className="detail-value" style={{ textTransform: 'capitalize' }}>
                      {selectedUser.gender || "Not provided"}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </Modal.Body>
          <Modal.Footer>
            {editingUser ? (
              <>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="primary" onClick={handleSubmit}>Save Changes</Button>
              </>
            ) : (
              <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}