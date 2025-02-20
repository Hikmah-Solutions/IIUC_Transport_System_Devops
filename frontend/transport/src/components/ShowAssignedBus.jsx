import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AssignedBuses = () => {
  const [assignments, setAssignments] = useState([]);
  const [status, setStatus] = useState({ loading: true, error: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [updatedBusNo, setUpdatedBusNo] = useState("");
  const [updatedScheduleName, setUpdatedScheduleName] = useState("");
  const [updatedBusType, setUpdatedBusType] = useState("");
  const [updatedActiveStatus, setUpdatedActiveStatus] = useState(true);
  const navigate = useNavigate();

  const fetchAssignments = async () => {
    try {
      const response = await fetch("http://147.93.107.88:5000/api/admin/assign-bus");
      const result = await response.json();

      if (response.ok) {
        setAssignments(result.buses || []);
        setStatus({ loading: false, error: "" });
      } else {
        throw new Error(result.message || "Failed to fetch assignments.");
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setStatus({ loading: false, error: error.message });
    }
  };

  const handleEdit = (assignment) => {
    setEditingId(assignment.id);
    setUpdatedBusNo(assignment.busNo);
    setUpdatedScheduleName(assignment.scheduleName);
    setUpdatedBusType(assignment.busType);
    setUpdatedActiveStatus(assignment.active);
  };

  const handleUpdate = async (id) => {
    if (!updatedBusNo || !updatedScheduleName || !updatedBusType) return;

    try {
      const response = await fetch(`http://147.93.107.88:5000/api/admin/assign-bus/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          busNo: updatedBusNo,
          scheduleName: updatedScheduleName,
          busType: updatedBusType,
          active: updatedActiveStatus,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === id ? { ...assignment, ...result } : assignment
          )
        );
        setEditingId(null);
        alert("Assignment updated successfully.");
      } else {
        throw new Error(result.message || "Failed to update assignment.");
      }
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;

    try {
      const response = await fetch(`http://147.93.107.88:5000/api/admin/assign-bus/${id}`, {
        method: "DELETE",
      });

      if (response.status === 204) {
        setAssignments((prevAssignments) => prevAssignments.filter((assignment) => assignment.id !== id));
        alert("Assignment deleted successfully.");
      } else {
        throw new Error("Failed to delete assignment.");
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await fetch(`http://147.93.107.88:5000/api/admin/assign-bus/${id}/toggle-active`, {
        method: "PATCH",
      });

      const result = await response.json();

      if (response.ok) {
        setAssignments((prevAssignments) =>
          prevAssignments.map((assignment) =>
            assignment.id === id ? { ...assignment, active: result.assignBus.active } : assignment
          )
        );
      } else {
        throw new Error(result.message || "Failed to update status.");
      }
    } catch (error) {
      console.error("Error toggling active status:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const busNo = assignment.busNo ? assignment.busNo.toString().toLowerCase() : "";
    const matchesSearch = busNo.includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "All" || assignment.busType === filterType;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (status.loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (status.error) {
    return <p className="text-center text-red-500">{status.error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Assigned Buses</h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by Bus Number"
          className="border px-4 py-2 rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border px-4 py-2 rounded">
          <option value="All">All Types</option>
          <option value="Students">Students</option>
          <option value="Teachers">Teachers</option>
          <option value="Staff">Staff</option>
        </select>

        <button onClick={() => navigate("/assignBus")} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Assign New Bus
        </button>
      </div>

      {filteredAssignments.length === 0 ? (
        <p className="text-center">No assigned buses available.</p>
      ) : (
        <table className="min-w-full bg-white border rounded shadow-md">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Bus Number</th>
              <th className="py-2 px-4 border-b">Slot Name</th>
              <th className="py-2 px-4 border-b">Road</th>
                <th className="py-2 px-4 border-b">Bus Type</th>
                <th className="py-2 px-4 border-b">Gender</th>
                <th className="py-2 px-4 border-b">Driver Name</th>
                <th className="py-2 px-4 border-b">Helper Name</th>
               <th className="py-2 px-4 border-b">Status</th>
               <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssignments.map(({ id, busNo, scheduleName,route,Gender,driverName,helperName,busType, active }) => (
              <tr key={id}>
                {editingId === id ? (
                  <>
                    <td className="py-2 px-4 border-b text-center">
                      <input value={updatedBusNo} onChange={(e) => setUpdatedBusNo(e.target.value)} className="border px-2 py-1 rounded w-full" />
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <input value={updatedScheduleName} onChange={(e) => setUpdatedScheduleName(e.target.value)} className="border px-2 py-1 rounded w-full" />
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <input value={updatedBusType} onChange={(e) => setUpdatedBusType(e.target.value)} className="border px-2 py-1 rounded w-full" />
                    </td>
                    <td className="py-2 px-4 border-b text-center">{active ? "Active" : "Inactive"}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <button onClick={() => handleUpdate(id)} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Save</button>
                      <button onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-2 px-4 border-b text-center">{busNo}</td>
                    <td className="py-2 px-4 border-b text-center">{scheduleName}</td>
                    <td className="py-2 px-4 border-b text-center">{route}</td>
                    <td className="py-2 px-4 border-b text-center">{Gender}</td>
                    <td className="py-2 px-4 border-b text-center">{driverName}</td>
                    <td className="py-2 px-4 border-b text-center">{helperName}</td>
                    <td className="py-2 px-4 border-b text-center">{busType}</td>
                    <td className="py-2 px-4 border-b text-center">{active ? "Active" : "Inactive"}</td>
                    <td className="py-2 px-4 border-b text-center">
                      <button onClick={() => handleEdit({ id, busNo, scheduleName, busType, active })} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Edit</button>
                      <button onClick={() => handleDelete(id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignedBuses;
