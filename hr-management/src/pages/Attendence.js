import React, { useEffect, useState } from "react";
import "../css/Attendence.css";

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/api/getAllEmployee")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);

        // Initialize attendance from the fetched data
        const initialAttendance = {};
        data.forEach((emp) => {
          initialAttendance[emp._id] = emp.attendanceStatus || "";
        });
        setAttendance(initialAttendance);
      })
      .catch((err) => setError("Failed to fetch employees"));
  }, []);

  const handleAttendanceChange = (empId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [empId]: status,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSaveAttendance = () => {
    const attendanceArray = Object.entries(attendance).map(([id, status]) => ({
      id,
      status,
    }));

    // ✅ Log what you are sending to the backend
    console.log("Sending attendance data to backend:", attendanceArray);

    fetch("http://localhost:4000/api/attendance/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendanceArray),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update attendance");
        return res.json();
      })
      .then((data) => {
        setSuccess("Attendance updated successfully!", data);
        setError(null);
      })
      .catch((err) => {
        setError("Error updating attendance. Please try again.", err);
        setSuccess(null);
      });
  };

  return (
    <div className="attendance-container">
      <h2>Attendance Management</h2>

      {error && <p className="message error-message">{error}</p>}
      {success && <p className="message success-message">{success}</p>}

      <div className="table-wrapper">
        <table
          className="attendance-table"
          border="1"
          cellPadding="10"
          cellSpacing="0"
        >
          <thead>
            <tr>
              <th>Profile</th>
              <th>Employee Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <div className="profile-circle">
                      {emp.name ? emp.name.charAt(0).toUpperCase() : "N/A"}
                    </div>
                  </td>
                  <td>{emp.name || "N/A"}</td>
                  <td>{emp.email || "N/A"}</td>
                  <td>{emp.phone || "N/A"}</td>
                  <td>{emp.position || "N/A"}</td>
                  <td>
                    <select
                      className="attendance-select"
                      value={attendance[emp._id] || ""}
                      onChange={(e) =>
                        handleAttendanceChange(emp._id, e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <button className="save-btn" onClick={handleSaveAttendance}>
        Save Attendance
      </button>
    </div>
  );
};

export default Attendance;
