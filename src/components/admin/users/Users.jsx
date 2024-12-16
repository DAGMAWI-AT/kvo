import React, { useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState(
    Array.from({ length: 10 }, (_, index) => ({
      id: `CSO-${String(index + 1).padStart(3, '0')}`,
      email: `user${index + 1}@example.com`,
      password: '********',
      status: index % 2 === 0 ? 'Active' : 'Inactive',
      role: index % 3 === 0 ? 'Admin' : 'User',
    }))
  );

  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showViewUserForm, setShowViewUserForm] = useState(false); // State for viewing user details
  const [showEditUserForm, setShowEditUserForm] = useState(false); // State for edit modal

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    status: 'Active',
    role: 'User',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const totalPages = Math.ceil(users.length / usersPerPage);

  const [selectedUser, setSelectedUser] = useState(null); // State for the selected user to view

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleAddUser = () => {
    const newId = `CSO-${String(users.length + 1).padStart(3, '0')}`;
    setUsers([...users, { id: newId, ...newUser }]);
    setNewUser({ email: '', password: '', status: 'Active', role: 'User' });
    setShowAddUserForm(false);
  };

  const handleView = (user) => {
    setSelectedUser(user); // Set the selected user for viewing
    setShowViewUserForm(true); // Show the "View User" modal
  };
  const handleEditUser = () => {
    setUsers(
      users.map((user) =>
        user.id === selectedUser.id ? { ...user, ...newUser } : user
      )
    );
    setNewUser({ email: '', password: '', status: 'Active', role: 'User' });
    setShowEditUserForm(false);
  };
  const handleRemove = (id) => {
    if (window.confirm(`Are you sure you want to remove user with ID: ${id}?`)) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <div className="container mx-auto p-2 lg:p-4 font-serif">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl lg:text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setShowAddUserForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </div>

      {/* Add User Modal */}
      {showAddUserForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-3 rounded-lg shadow-lg w-96 lg:w-1/3">
            <h2 className="text-lg lg:text-xl font-bold mb-4 text-gray-500">Register New User</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddUser();
              }}
            >
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={newUser.status}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddUserForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditUserForm && selectedUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4 text-gray-500">Edit User Details</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditUser();
              }}
            >
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, password: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  value={newUser.status}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, status: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="role" className="block text-gray-700">
                  Role
                </label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowEditUserForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {showViewUserForm && selectedUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-96 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4 text-gray-500">User Details</h2>
            <div className="mb-4">
              <p>
                <strong>User ID:</strong> {selectedUser.id}
              </p>
            </div>
            <div className="mb-4">
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
            </div>
            <div className="mb-4">
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
            </div>
            <div className="mb-4">
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowViewUserForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">User ID</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Password</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Role</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2 border-b text-center">{user.id}</td>
                <td className="px-4 py-2 border-b text-center">{user.email}</td>
                <td className="px-4 py-2 border-b text-center">{user.password}</td>
                <td
                  className={`px-4 py-2 border-b text-center ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {user.status}
                </td>
                <td className="px-4 py-2 border-b text-center">{user.role}</td>
                <td className="px-4 py-2 text-center flex">
                  <button
                    onClick={() => handleView(user)}
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setNewUser({
                        email: user.email,
                        password: '********',
                        status: user.status,
                        role: user.role,
                      });
                      setShowEditUserForm(true);
                    }}
                    className="bg-yellow-500 text-white px-2 py-1 mr-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleRemove(user.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-2 py-1 lg:px-4 lg:py-2 rounded ${currentPage === 1
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-700'
            }`}
        >
          Previous
        </button>
        <span>
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-2 py-1 lg:px-4 lg:py-2 rounded ${currentPage === totalPages
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-700'
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
