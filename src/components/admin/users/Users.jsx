import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  // Form states
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    registrationId: '',
    name: '',
    userId: '',
    email: '',
    password: '',
    role: 'cso',
    status: 'active'
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const decoded = jwtDecode(token);
        if (decoded.role !== "admin") throw new Error("Admin access required");

        const response = await fetch("http://localhost:5000/api/users/users", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  // Search and filter functionality
  useEffect(() => {
    const results = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.registrationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.userId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // Export functionality
  const exportToExcel = () => {
    const selectedData = filteredUsers.filter(user =>
      selectedRows.includes(user.id)
    );
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, "users.xlsx");
  };

  const exportToPDF = () => {
    const selectedData = filteredUsers.filter(user =>
      selectedRows.includes(user.id)
    );
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID', 'Name', 'Email', 'Role', 'Status']],
      body: selectedData.map(user => [
        user.userId,
        user.name,
        user.email,
        user.role,
        user.status
      ]),
    });
    doc.save("users.pdf");
  };

  // CRUD Operations
  const handleAddUser = () => {
    navigate("/admin/create_userAccount");
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/users/update/${selectedUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to update user");

      const updatedUser = await response.json();
      setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
      setFilteredUsers(filteredUsers.map(user => user.id === updatedUser.id ? updatedUser : user));
      setShowEditUserForm(false);
      Swal.fire('Success!', 'User updated successfully.', 'success');
    } catch (err) {
      Swal.fire('Error', err.message, 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/api/users/remove/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
          });

          if (!response.ok) throw new Error("Failed to delete user");

          setUsers(users.filter(user => user.id !== id));
          setFilteredUsers(filteredUsers.filter(user => user.id !== id));
          Swal.fire('Deleted!', 'User has been deleted.', 'success');
        } catch (err) {
          Swal.fire('Error', err.message, 'error');
        }
      }
    });
  };

  // Pagination
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="container mx-auto p-4">
      {/* Header and Controls */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">User Management</h1>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search users..."
            className="p-2 border rounded w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleAddUser}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Export Controls */}
      <div className="mb-4 flex gap-4">
        <button
          onClick={exportToExcel}
          disabled={selectedRows.length === 0}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-600"
        >
          Export to Excel
        </button>
        <button
          onClick={exportToPDF}
          disabled={selectedRows.length === 0}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-red-600"
        >
          Export to PDF
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.length === paginatedUsers.length}
                  onChange={(e) => {
                    const ids = paginatedUsers.map(u => u.id);
                    e.target.checked
                      ? setSelectedRows([...new Set([...selectedRows, ...ids])])
                      : setSelectedRows(selectedRows.filter(id => !ids.includes(id)));
                  }}
                />
              </th>
              <th className="px-4 py-3 text-left">Registration ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">User ID</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => setSelectedRows(prev =>
                      prev.includes(user.id)
                        ? prev.filter(id => id !== user.id)
                        : [...prev, user.id]
                    )}
                  />
                </td>
                <td className="px-4 py-3">{user.registrationId}</td>
                <td className="px-4 py-3">{user.name}</td>
                <td className="px-4 py-3">{user.userId}</td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 capitalize">{user.role}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-sm 
                    ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setFormData(user);
                      setShowEditUserForm(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span>
          Page {currentPage} of {Math.ceil(filteredUsers.length / usersPerPage)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredUsers.length / usersPerPage), p + 1))}
            disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditUserForm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="space-y-4">
                {/* <div>
                  <label className="block mb-2">Registration ID</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded"
                    value={formData.registrationId}
                    onChange={(e) => setFormData({ ...formData, registrationId: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full p-2 border rounded"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block mb-2">Role</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="cso">CSO</option>
                    <option value="admin">Admin</option>
                  </select>
                </div> */}
                <div>
                  <label className="block mb-2">Status</label>
                  <select
                    className="w-full p-2 border rounded"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowEditUserForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default Users;