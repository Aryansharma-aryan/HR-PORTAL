import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Attendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetch("https://hr-portal-1-xf68.onrender.com/api/getAllEmployee")
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);

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

    fetch("https://hr-portal-1-xf68.onrender.com/api/attendance/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(attendanceArray),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update attendance");
        return res.json();
      })
      .then((data) => {
        setSuccess("Attendance updated successfully!");
        setError(null);
      })
      .catch((err) => {
        setError("Error updating attendance. Please try again.");
        setSuccess(null);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-primary">Attendance Management</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="table-responsive">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
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
                <td colSpan="6" className="text-center text-muted">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <div
                      className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center"
                      style={{ width: "40px", height: "40px", margin: "auto" }}
                    >
                      {emp.name ? emp.name.charAt(0).toUpperCase() : "N"}
                    </div>
                  </td>
                  <td>{emp.name || "N/A"}</td>
                  <td>{emp.email || "N/A"}</td>
                  <td>{emp.phone || "N/A"}</td>
                  <td>{emp.position || "N/A"}</td>
                  <td>
                    <select
                      className="form-select"
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

      <div className="text-center mt-4">
        <button className="btn btn-primary px-4" onClick={handleSaveAttendance}>
          Save Attendance
        </button>
      </div>
    </div>
  );
};

export default Attendance;
