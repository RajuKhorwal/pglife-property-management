// frontend/src/pages/admin/AdminAmenities.jsx
import React, { useEffect, useState, useContext } from "react";
import { Table, Button, Modal, Form, Spinner, Badge } from "react-bootstrap";
import { FaTools, FaEdit, FaTrash, FaPlus, FaFilter, FaCheckCircle, FaBuilding, FaCouch, FaBed, FaShower } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function AdminAmenities() {
  const { tokenHeader } = useContext(AuthContext);

  const [amenities, setAmenities] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState(null);
  const [filterType, setFilterType] = useState("All");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);

  const [formData, setFormData] = useState({
    propertyId: "",
    name: "",
    type: "Building",
    icon: "wifi",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [amenityRes, propertyRes] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/amenities`, { headers: tokenHeader }),
        axios.get(`${API_BASE}/api/admin/properties`, { headers: tokenHeader }),
      ]);
      setAmenities(amenityRes.data.amenities || []);
      setProperties(propertyRes.data.properties || []);
    } catch (err) {
      console.error("Error fetching amenities/properties:", err);
      toast.error("Failed to load data ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tokenHeader]);

  const openForm = (amenity = null) => {
    if (amenity) {
      setEditingAmenity(amenity);
      setFormData({
        propertyId: amenity.property?._id || "",
        name: amenity.name,
        type: amenity.type,
        icon: amenity.icon || "wifi",
      });
    } else {
      setEditingAmenity(null);
      setFormData({
        propertyId: "",
        name: "",
        type: "Building",
        icon: "wifi",
      });
    }
    setShowForm(true);
  };

  const openDetail = (amenity) => {
    setSelectedAmenity(amenity);
    setShowDetail(true);
  };

  const handleSubmit = async () => {
    const { propertyId, name, type, icon } = formData;

    if (!propertyId || !name || !type) {
      toast.error("All fields are required ❌");
      return;
    }

    try {
      let res;
      if (editingAmenity) {
        res = await axios.put(
          `${API_BASE}/api/admin/amenities/${editingAmenity._id}`,
          { propertyId, name, type, icon },
          { headers: tokenHeader }
        );
        setAmenities(
          amenities.map((a) =>
            a._id === editingAmenity._id ? res.data.amenity : a
          )
        );
        toast.success("Amenity updated ✅");
      } else {
        await axios.post(
          `${API_BASE}/api/admin/properties/${propertyId}/amenities`,
          { name, type, icon },
          { headers: tokenHeader }
        );
        await fetchData();
        toast.success("Amenity added ✅");
      }
      setShowForm(false);
    } catch (err) {
      console.error("Error saving amenity:", err);
      toast.error("Failed to save amenity ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this amenity?"))
      return;
    try {
      await axios.delete(`${API_BASE}/api/admin/amenities/${id}`, {
        headers: tokenHeader,
      });
      setAmenities(amenities.filter((a) => a._id !== id));
      toast.success("Amenity deleted ✅");
    } catch (err) {
      console.error("Error deleting amenity:", err);
      toast.error("Failed to delete amenity ❌");
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Building": return <FaBuilding />;
      case "Common Area": return <FaCouch />;
      case "Bedroom": return <FaBed />;
      case "Washroom": return <FaShower />;
      default: return <FaCheckCircle />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "Building": return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      case "Common Area": return "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)";
      case "Bedroom": return "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
      case "Washroom": return "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)";
      default: return "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
  };

  const filteredAmenities = amenities.filter(
    (a) => filterType === "All" || a.type === filterType
  );

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" style={{ color: "#667eea" }} />
        <p style={{ marginTop: "15px", color: "#6b7280" }}>Loading amenities...</p>
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

          .amenities-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            flex-wrap: wrap;
            gap: 15px;
          }

          .amenities-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 0;
          }

          .amenities-controls {
            display: flex;
            gap: 12px;
            align-items: center;
          }

          .filter-select {
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            padding: 10px 16px;
            font-weight: 500;
            transition: all 0.3s ease;
            min-width: 180px;
          }

          .filter-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
            outline: none;
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

          .amenities-stats {
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

          .amenities-table-container {
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

          .property-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #f3f4f6;
            padding: 6px 14px;
            border-radius: 15px;
            font-size: 13px;
            font-weight: 500;
            color: #6b7280;
          }

          .amenity-name {
            font-weight: 600;
            color: #1f2937;
          }

          .type-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: var(--gradient);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 600;
          }

          .icon-preview {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 600;
            font-size: 12px;
            text-transform: uppercase;
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
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
          }

          .action-btn.edit:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
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
          .amenity-modal .modal-content {
            border: none;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .amenity-modal .modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 25px 30px;
          }

          .amenity-modal .modal-title {
            font-weight: 700;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .amenity-modal .btn-close {
            filter: brightness(0) invert(1);
            opacity: 1;
          }

          .amenity-modal .modal-body {
            padding: 30px;
          }

          .amenity-modal .form-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            font-size: 14px;
          }

          .amenity-modal .form-control,
          .amenity-modal .form-select {
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            padding: 12px 16px;
            transition: all 0.3s ease;
            font-size: 14px;
          }

          .amenity-modal .form-control:focus,
          .amenity-modal .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          }

          .amenity-modal .modal-footer {
            border: none;
            padding: 20px 30px;
            background: #f9fafb;
          }

          .amenity-modal .btn-secondary {
            background: #6b7280;
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
          }

          .amenity-modal .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
          }

          .amenity-modal .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
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

          .no-data {
            text-align: center;
            padding: 60px 20px;
            color: #9ca3af;
          }

          @media (max-width: 768px) {
            .amenities-header {
              flex-direction: column;
              align-items: stretch;
            }

            .amenities-controls {
              flex-direction: column;
            }

            .filter-select,
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
        <div className="amenities-header">
          <h3 className="amenities-title">
            <FaTools /> Manage Amenities
          </h3>
          <div className="amenities-controls">
            <Form.Select
              className="filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types</option>
              <option value="Building">🏢 Building</option>
              <option value="Common Area">🛋️ Common Area</option>
              <option value="Bedroom">🛏️ Bedroom</option>
              <option value="Washroom">🚿 Washroom</option>
            </Form.Select>
            <button className="add-button" onClick={() => openForm()}>
              <FaPlus /> Add Amenity
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="amenities-stats">
          <div className="stat-card" style={{ '--gradient': 'linear-gradient(90deg, #667eea, #764ba2)' }}>
            <div className="stat-label">Total</div>
            <div className="stat-value">{amenities.length}</div>
          </div>
          <div className="stat-card" style={{ '--gradient': 'linear-gradient(90deg, #667eea, #764ba2)' }}>
            <div className="stat-label">Building</div>
            <div className="stat-value">{amenities.filter(a => a.type === 'Building').length}</div>
          </div>
          <div className="stat-card" style={{ '--gradient': 'linear-gradient(90deg, #f093fb, #f5576c)' }}>
            <div className="stat-label">Common Area</div>
            <div className="stat-value">{amenities.filter(a => a.type === 'Common Area').length}</div>
          </div>
          <div className="stat-card" style={{ '--gradient': 'linear-gradient(90deg, #4facfe, #00f2fe)' }}>
            <div className="stat-label">Bedroom</div>
            <div className="stat-value">{amenities.filter(a => a.type === 'Bedroom').length}</div>
          </div>
          <div className="stat-card" style={{ '--gradient': 'linear-gradient(90deg, #43e97b, #38f9d7)' }}>
            <div className="stat-label">Washroom</div>
            <div className="stat-value">{amenities.filter(a => a.type === 'Washroom').length}</div>
          </div>
        </div>

        {filteredAmenities.length === 0 ? (
          <div className="no-data">
            <FaTools style={{ fontSize: '4rem', opacity: 0.3, marginBottom: '15px' }} />
            <h4>No amenities found</h4>
            <p>{filterType !== "All" ? `No ${filterType} amenities available` : "Start by adding your first amenity"}</p>
          </div>
        ) : (
          <div className="amenities-table-container">
            <Table className="modern-table" hover>
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Amenity Name</th>
                  <th>Type</th>
                  <th>Icon</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAmenities.map((a) => (
                  <tr
                    key={a._id}
                    onClick={() => openDetail(a)}
                  >
                    <td>
                      <span className="property-badge">
                        <FaBuilding />
                        {a.property?.name || "N/A"}
                      </span>
                    </td>
                    <td className="amenity-name">{a.name}</td>
                    <td>
                      <span 
                        className="type-badge" 
                        style={{ '--gradient': getTypeColor(a.type) }}
                      >
                        {getTypeIcon(a.type)}
                        {a.type}
                      </span>
                    </td>
                    <td>
                      <div className="icon-preview">
                        {a.icon || "-"}
                      </div>
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            openForm(a);
                          }}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(a._id);
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
        )}

        {/* Add/Edit Modal */}
        <Modal
          show={showForm}
          onHide={() => setShowForm(false)}
          centered
          className="amenity-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaTools />
              {editingAmenity ? "Edit Amenity" : "Add New Amenity"}
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
                <Form.Label>Amenity Name</Form.Label>
                <Form.Control
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter amenity name"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Type</Form.Label>
                <Form.Select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="Building">🏢 Building</option>
                  <option value="Common Area">🛋️ Common Area</option>
                  <option value="Bedroom">🛏️ Bedroom</option>
                  <option value="Washroom">🚿 Washroom</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Icon</Form.Label>
                <Form.Select
                  value={formData.icon}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                >
                  <option value="wifi">📶 WiFi</option>
                  <option value="tv">📺 TV</option>
                  <option value="ac">❄️ AC</option>
                  <option value="geyser">🔥 Geyser</option>
                  <option value="powerbackup">🔋 Power Backup</option>
                  <option value="fireext">🧯 Fire Extinguisher</option>
                  <option value="bed">🛏️ Bed</option>
                  <option value="parking">🅿️ Parking</option>
                  <option value="rowater">💧 RO Water</option>
                  <option value="dining">🍽️ Dining</option>
                  <option value="washingmachine">🧺 Washing Machine</option>
                  <option value="lift">🛗 Lift</option>
                  <option value="cctv">📹 CCTV</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingAmenity ? "Update Amenity" : "Add Amenity"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Detail Modal */}
        <Modal
          show={showDetail}
          onHide={() => setShowDetail(false)}
          centered
          className="amenity-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaCheckCircle /> Amenity Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAmenity && (
              <>
                <div className="detail-item">
                  <div className="detail-icon"><FaBuilding /></div>
                  <div className="detail-content">
                    <div className="detail-label">Property</div>
                    <div className="detail-value">{selectedAmenity.property?.name || "N/A"}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon"><FaCheckCircle /></div>
                  <div className="detail-content">
                    <div className="detail-label">Amenity Name</div>
                    <div className="detail-value">{selectedAmenity.name}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">{getTypeIcon(selectedAmenity.type)}</div>
                  <div className="detail-content">
                    <div className="detail-label">Type</div>
                    <div className="detail-value">{selectedAmenity.type}</div>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">
                    <span style={{ fontSize: '18px' }}>
                      {selectedAmenity.icon || "🔧"}
                    </span>
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Icon</div>
                    <div className="detail-value">{selectedAmenity.icon || "-"}</div>
                  </div>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetail(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}