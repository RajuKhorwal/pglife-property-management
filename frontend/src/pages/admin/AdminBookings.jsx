// frontend/src/pages/admin/AdminBookings.jsx
import React from "react";
import { Table } from "react-bootstrap";

export default function AdminBookings() {
  return (
    <div>
      <h3>📋 Manage Bookings</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Property</th>
            <th>User</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* Map interested/bookings here */}
          <tr>
            <td>1</td>
            <td>Sample PG</td>
            <td>Jane Doe</td>
            <td>2025-09-13</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
}
