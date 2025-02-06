import React, { useState } from "react";

const EditProfile = ({ initialData, onUpdate }) => {
  const [formData, setFormData] = useState(initialData);
  const [imageFile, setImageFile] = useState( formData.photo);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prevData) => ({
        ...prevData,
        photo: imageUrl,
      }));
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only proceed with image upload if a new file is selected
      if (imageFile) {
        const formDataImage = new FormData();
        formDataImage.append("photo", imageFile);
  
        const imageUploadResponse = await fetch(
          "http://localhost:5000/api/staff/register",
          {
            method: "POST",
            body: formDataImage,
          }
        );
  
        const imageResult = await imageUploadResponse.json();
        if (imageResult.success) {
          formData.photo = imageResult.imageUrl; // Update with uploaded image URL
        }
      }
  
      // Now send the profile update request
      const response = await fetch(
        `http://localhost:5000/api/staff/update/${formData.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        onUpdate(result); // Pass updated data to parent
        alert("Profile updated successfully");
      } else {
        alert(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating profile");
    }
  };
  

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center">
        <img
          src={formData.photo}
          alt="Profile"
          className="w-28 h-28 rounded-full border-2 border-gray-300 object-cover"
        />
        <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded mt-2">
          Change Picture
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Phone</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Position</label>
        <input
          type="text"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div>
        <label className="block text-gray-700 font-medium mb-1">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        >
          <option value="admin">Admin</option>
          <option value="cso">CSO</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditProfile;
