// frontend/src/pages/admin/AdminProperties.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Table, Button, Spinner, Modal, Form, Badge } from "react-bootstrap";
import { FaBuilding, FaEdit, FaTrash, FaPlus, FaMapMarkerAlt, FaRupeeSign, FaImages, FaCheckCircle, FaComments, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function AdminProperties() {
  const { tokenHeader } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    gender: "male",
    rent: "",
    cityName: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admin/properties`, {
        headers: tokenHeader,
      });
      setProperties(res.data.properties || []);
    } catch (err) {
      console.error("Error fetching properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [tokenHeader]);

  const handleAdd = () => {
    setEditingProperty(null);
    setFormData({
      name: "",
      address: "",
      gender: "male",
      rent: "",
      cityName: "",
    });
    setExistingImages([]);
    setNewImages([]);
    setShowForm(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      name: property.name,
      address: property.address,
      gender: property.gender,
      rent: property.rent,
      cityName: property.city?.name || "",
    });
    setExistingImages(property.images || []);
    setNewImages([]);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    const { name, address, gender, rent, cityName } = formData;

    if (!name || !address || !gender || !rent || !cityName) {
      toast.error("All fields are required ❌");
      return;
    }

    try {
      const form = new FormData();
      form.append("name", name);
      form.append("address", address);
      form.append("gender", gender);
      form.append("rent", rent);
      form.append("cityName", cityName);

      existingImages.forEach((img) => form.append("existingImages", img));
      newImages.forEach((file) => form.append("images", file));

      let res;
      if (editingProperty) {
        res = await axios.put(
          `${API_BASE}/api/admin/properties/${editingProperty._id}`,
          form,
          {
            headers: {
              ...tokenHeader,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setProperties(
          properties.map((p) =>
            p._id === editingProperty._id ? res.data.property : p
          )
        );
        toast.success("Property updated successfully ✅");
      } else {
        res = await axios.post(`${API_BASE}/api/admin/properties`, form, {
          headers: {
            ...tokenHeader,
            "Content-Type": "multipart/form-data",
          },
        });
        setProperties([res.data.property, ...properties]);
        toast.success("Property added successfully ✅");
      }

      setShowForm(false);
    } catch (err) {
      console.error("Error saving property:", err);
      toast.error("Failed to save property ❌");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?"))
      return;

    try {
      await axios.delete(`${API_BASE}/api/admin/properties/${id}`, {
        headers: tokenHeader,
      });
      setProperties(properties.filter((p) => p._id !== id));
      toast.success("Property deleted successfully ✅");
    } catch (err) {
      console.error("Error deleting property:", err);
      toast.error("Failed to delete property ❌");
    }
  };

  const handleRowClick = async (property) => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/admin/properties/${property._id}`,
        {
          headers: tokenHeader,
        }
      );
      setPropertyDetails(res.data);
      setSelectedProperty(property);
      setShowDetail(true);
    } catch (err) {
      console.error("Failed to fetch property details:", err);
      toast.error("Could not load property details ❌");
    }
  };

  const getImageUrl = (img) => {
    if (img.startsWith("/uploads")) {
      return `${API_BASE}${img}`;
    }
    return img;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" style={{ color: "#667eea" }} />
        <p style={{ marginTop: "15px", color: "#6b7280" }}>Loading properties...</p>
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

          .properties-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
          }

          .properties-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #1f2937;
            display: flex;
            align-items: center;
            gap: 12px;
            margin: 0;
          }

          .add-button {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border: none;
            padding: 12px 28px;
            border-radius: 25px;
            font-weight: 600;
            font-size: 14px;
            color: white;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s ease;
          }

          .add-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
            background: linear-gradient(135deg, #059669 0%, #10b981 100%);
          }

          .properties-table-container {
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

          .property-name-cell {
            font-weight: 600;
            color: #1f2937;
          }

          .city-badge {
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

          .rent-amount {
            font-weight: 700;
            color: #667eea;
            font-size: 16px;
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
          .property-modal .modal-content {
            border: none;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .property-modal .modal-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 25px 30px;
          }

          .property-modal .modal-title {
            font-weight: 700;
            font-size: 1.5rem;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .property-modal .btn-close {
            filter: brightness(0) invert(1);
            opacity: 1;
          }

          .property-modal .modal-body {
            padding: 30px;
            max-height: 70vh;
            overflow-y: auto;
          }

          .property-modal .form-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            font-size: 14px;
          }

          .property-modal .form-control,
          .property-modal .form-select {
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            padding: 12px 16px;
            transition: all 0.3s ease;
            font-size: 14px;
          }

          .property-modal .form-control:focus,
          .property-modal .form-select:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          }

          .image-preview-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 12px;
            margin-top: 15px;
          }

          .image-preview-item {
            position: relative;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          .image-preview-item img {
            width: 100%;
            height: 90px;
            object-fit: cover;
            display: block;
          }

          .image-remove-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: #ef4444;
            color: white;
            border: none;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            padding: 0;
          }

          .image-remove-btn:hover {
            background: #dc2626;
            transform: scale(1.1);
          }

          .property-modal .modal-footer {
            border: none;
            padding: 20px 30px;
            background: #f9fafb;
          }

          .property-modal .btn-secondary {
            background: #6b7280;
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
          }

          .property-modal .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 25px;
            padding: 10px 24px;
            font-weight: 600;
          }

          .property-modal .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
          }

          .detail-section {
            background: #f9fafb;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 20px;
          }

          .detail-section h5 {
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .detail-item {
            display: flex;
            gap: 10px;
            margin-bottom: 12px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e5e7eb;
          }

          .detail-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
          }

          .detail-label {
            font-weight: 600;
            color: #6b7280;
            min-width: 100px;
          }

          .detail-value {
            color: #1f2937;
            font-weight: 500;
          }

          .amenity-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 10px;
            margin-top: 10px;
          }

          .amenity-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: white;
            border-radius: 8px;
            font-size: 13px;
          }

          .amenity-item svg {
            color: #10b981;
          }

          .testimonial-item {
            background: white;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 12px;
            border-left: 4px solid #667eea;
          }

          .testimonial-author {
            font-weight: 600;
            color: #667eea;
            margin-bottom: 8px;
          }

          .testimonial-content {
            color: #4b5563;
            font-size: 14px;
            line-height: 1.6;
          }

          .no-data {
            text-align: center;
            padding: 40px;
            color: #9ca3af;
          }

          @media (max-width: 768px) {
            .properties-header {
              flex-direction: column;
              align-items: flex-start;
              gap: 15px;
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
        <div className="properties-header">
          <h3 className="properties-title">
            <FaBuilding /> Manage Properties
          </h3>
          <button className="add-button" onClick={handleAdd}>
            <FaPlus /> Add New Property
          </button>
        </div>

        {properties.length === 0 ? (
          <div className="no-data">
            <FaBuilding style={{ fontSize: '4rem', opacity: 0.3, marginBottom: '15px' }} />
            <h4>No properties found</h4>
            <p>Start by adding your first property</p>
          </div>
        ) : (
          <div className="properties-table-container">
            <Table className="modern-table" hover>
              <thead>
                <tr>
                  <th>Property Name</th>
                  <th>City</th>
                  <th>Rent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((p) => (
                  <tr
                    key={p._id}
                    onClick={(e) => {
                      if (
                        e.target.tagName !== "BUTTON" &&
                        !e.target.closest('.action-btn')
                      ) {
                        handleRowClick(p);
                      }
                    }}
                  >
                    <td className="property-name-cell">{p.name}</td>
                    <td>
                      <span className="city-badge">
                        <FaMapMarkerAlt />
                        {p.city?.name || "N/A"}
                      </span>
                    </td>
                    <td>
                      <span className="rent-amount">₹ {p.rent.toLocaleString()}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(p);
                          }}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(p._id);
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

        {/* Form Modal */}
        <Modal
          show={showForm}
          onHide={() => setShowForm(false)}
          centered
          className="property-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaBuilding />
              {editingProperty ? "Edit Property" : "Add New Property"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Property Name</Form.Label>
                <Form.Control
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter property name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter full address"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>City</Form.Label>
                <Form.Control
                  value={formData.cityName}
                  onChange={(e) =>
                    setFormData({ ...formData, cityName: e.target.value })
                  }
                  placeholder="Enter city name"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Monthly Rent (₹)</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.rent}
                  onChange={(e) =>
                    setFormData({ ...formData, rent: e.target.value })
                  }
                  placeholder="Enter monthly rent"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Gender</Form.Label>
                <Form.Select
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="unisex">Unisex</option>
                </Form.Select>
              </Form.Group>
              
              {(existingImages.length > 0 || newImages.length > 0) && (
                <Form.Group className="mb-3">
                  <Form.Label>Current Images</Form.Label>
                  <div className="image-preview-grid">
                    {existingImages.map((img, idx) => (
                      <div key={`existing-${idx}`} className="image-preview-item">
                        <img src={getImageUrl(img)} alt={`existing-${idx}`} />
                        <button
                          className="image-remove-btn"
                          onClick={() =>
                            setExistingImages(
                              existingImages.filter((_, i) => i !== idx)
                            )
                          }
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                    {newImages.map((file, idx) => (
                      <div key={`new-${idx}`} className="image-preview-item">
                        <img src={URL.createObjectURL(file)} alt={`new-${idx}`} />
                        <button
                          className="image-remove-btn"
                          onClick={() =>
                            setNewImages(newImages.filter((_, i) => i !== idx))
                          }
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </Form.Group>
              )}

              <Form.Group className="mb-3">
                <Form.Label>Add Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    setNewImages(Array.from(e.target.files));
                    e.target.value = "";
                  }}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {editingProperty ? "Update Property" : "Add Property"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Detail Modal */}
        <Modal
          show={showDetail}
          onHide={() => setShowDetail(false)}
          size="lg"
          centered
          className="property-modal"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <FaBuilding /> Property Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {propertyDetails && propertyDetails.property && (
              <>
                <div className="detail-section">
                  <h5><FaBuilding /> Basic Information</h5>
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{propertyDetails.property.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Address:</span>
                    <span className="detail-value">{propertyDetails.property.address}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">City:</span>
                    <span className="detail-value">{propertyDetails.property.city?.name || "N/A"}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Rent:</span>
                    <span className="detail-value">₹ {propertyDetails.property.rent.toLocaleString()}/month</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender:</span>
                    <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                      {propertyDetails.property.gender}
                    </span>
                  </div>
                </div>

                {propertyDetails.property.images && propertyDetails.property.images.length > 0 && (
                  <div className="detail-section">
                    <h5><FaImages /> Images</h5>
                    <div className="image-preview-grid">
                      {propertyDetails.property.images.map((img, idx) => (
                        <div key={idx} className="image-preview-item">
                          <img src={getImageUrl(img)} alt={`property-${idx}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="detail-section">
                  <h5><FaCheckCircle /> Amenities</h5>
                  {propertyDetails.amenities && propertyDetails.amenities.length > 0 ? (
                    <div className="amenity-list">
                      {propertyDetails.amenities.map((a) => (
                        <div key={a._id} className="amenity-item">
                          <FaCheckCircle />
                          <span>{a.name} ({a.type})</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#9ca3af', margin: 0 }}>No amenities added</p>
                  )}
                </div>

                <div className="detail-section">
                  <h5><FaComments /> Testimonials</h5>
                  {propertyDetails.testimonials && propertyDetails.testimonials.length > 0 ? (
                    propertyDetails.testimonials.map((t) => (
                      <div key={t._id} className="testimonial-item">
                        <div className="testimonial-author">{t.user_name}</div>
                        <div className="testimonial-content">{t.content}</div>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: '#9ca3af', margin: 0 }}>No testimonials yet</p>
                  )}
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="warning"
              onClick={() => {
                setShowDetail(false);
                handleEdit(selectedProperty);
              }}
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none',
                borderRadius: '25px',
                padding: '10px 24px',
                fontWeight: '600'
              }}
            >
              <FaEdit /> Edit
            </Button>
            <Button
              variant="danger"
              onClick={async () => {
                if (
                  window.confirm("Are you sure you want to delete this property?")
                ) {
                  await handleDelete(selectedProperty._id);
                  setShowDetail(false);
                }
              }}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                border: 'none',
                borderRadius: '25px',
                padding: '10px 24px',
                fontWeight: '600'
              }}
            >
              <FaTrash /> Delete
            </Button>
            <Button variant="secondary" onClick={() => setShowDetail(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}