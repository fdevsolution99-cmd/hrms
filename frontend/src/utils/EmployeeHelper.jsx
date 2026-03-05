import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import StatusToggle from "../components/employee/StatusToggle";
import { API_BASE } from "./apiConfig";

// Delete employee function
export const deleteEmployee = async (id) => {
  try {
    const response = await axios.delete(
      `${API_BASE}/api/employee/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.data.success) {
      return { success: true, message: response.data.message };
    }
  } catch (error) {
    if (error.response) {
      return { success: false, error: error.response.data.error };
    }
    return { success: false, error: "Network error" };
  }
  return { success: false, error: "Unknown error" };
};

export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "60px",
  },
  {
    name: "Employee ID",
    selector: (row) => row.employeeId,
    width: "110px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    width: "130px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    width: "110px",
  },
  {
    name: "Designation",
    selector: (row) => row.designation,
    width: "140px",
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    width: "110px",
  },
  {
    name: "Joining Date",
    selector: (row) => row.joiningDate,
    width: "110px",
  },
  {
    name: "Status",
    width: "110px",
    cell: (row) => (
      <StatusToggle
        employeeId={row._id}
        currentStatus={row.status}
        onStatusChange={row.onStatusChange}
      />
    ),
  },
  {
    name: "Action",
    cell: (row) => row.action,
    width: "400px",
    style: {
      paddingLeft: '0px',
      paddingRight: '0px',
    },
  },
];

export const fetchDepartments = async () => {
  let departments;
  try {
    const responnse = await axios.get(`${API_BASE}/api/department`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (responnse.data.success) {
      departments = responnse.data.departments;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return departments;
};

// employees for salary form
export const getEmployees = async (id) => {
  let employees;
  try {
    const responnse = await axios.get(
      `${API_BASE}/api/employee/department/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (responnse.data.success) {
      employees = responnse.data.employees;
    }
  } catch (error) {
    if (error.response && !error.response.data.success) {
      alert(error.response.data.error);
    }
  }
  return employees;
};





export const EmployeeButtons = ({ Id, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this employee? This action cannot be undone.")) {
      const result = await deleteEmployee(Id);
      if (result.success) {
        alert("Employee deleted successfully");
        if (onDelete) {
          onDelete();
        }
      } else {
        alert(result.error || "Failed to delete employee");
      }
    }
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap py-1">
      <button
        className="px-2.5 py-1.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white text-[11px] font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-w-[55px]"
        onClick={() => navigate(`/admin-dashboard/employees/${Id}`)}
      >
        View
      </button>
      <button
        className="px-2.5 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-[11px] font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-w-[55px]"
        onClick={() => navigate(`/admin-dashboard/employees/edit/${Id}`)}
      >
        Edit
      </button>
      <button
        className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white text-[11px] font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-w-[55px]"
        onClick={() => navigate(`/admin-dashboard/employees/salary/${Id}`)}
      >
        Salary
      </button>
      <button
        className="px-2.5 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-[11px] font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-w-[55px]"
        onClick={() => navigate(`/admin-dashboard/employees/leaves/${Id}`)}
      >
        Leave
      </button>
      <button
        className="px-2.5 py-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-[11px] font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 min-w-[55px]"
        onClick={handleDelete}
      >
        Delete
      </button>
    </div>
  );
};
