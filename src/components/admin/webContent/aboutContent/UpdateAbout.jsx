import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/about`;

const UpdateAbout = () => {
  const [formData, setFormData] = useState({
    introduction: "",
    mission: "",
    vision: "",
    purpose: "",
    core_values: [""],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [aboutId, setAboutId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch existing data
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get(API_URL);
        if (res.data?.data) {
          const { id, introduction, mission, vision, purpose, core_values } = res.data.data;
          setFormData({
            introduction,
            mission,
            vision,
            purpose,
            core_values: JSON.parse(core_values),
          });
          setAboutId(id);
          setIsEditing(true);
        }
      } catch (err) {
        console.log("No about_us data yet. Ready to create.");
      } finally {
        setLoading(false);
      }
    };

    fetchAbout();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle core value change
  const handleCoreValueChange = (index, value) => {
    const updated = [...formData.core_values];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      core_values: updated,
    }));
  };

  // Add new core value
  const addCoreValue = () => {
    setFormData((prev) => ({
      ...prev,
      core_values: [...prev.core_values, ""],
    }));
  };

  // Remove core value
  const removeCoreValue = (index) => {
    const updated = [...formData.core_values];
    updated.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      core_values: updated,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${aboutId}`, {
          ...formData,
        });
        alert("About info updated successfully ✅");
      } else {
        await axios.post(API_URL, {
          ...formData,
        });
        alert("About info created successfully ✅");
        setIsEditing(true); // prevent re-create
      }
    } catch (err) {
      console.error("Failed to submit:", err);
      alert("Error submitting About info ❌");
    }
  };

  if (loading) return <div className="p-6 text-blue-600">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white shadow p-6 rounded-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {isEditing ? "Edit About Info" : "Create About Info"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          name="introduction"
          placeholder="Introduction"
          rows={3}
          value={formData.introduction}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="mission"
          placeholder="Mission"
          rows={3}
          value={formData.mission}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="vision"
          placeholder="Vision"
          rows={3}
          value={formData.vision}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="purpose"
          placeholder="Purpose"
          rows={3}
          value={formData.purpose}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <div>
          <label className="block text-sm font-medium mb-2">Core Values</label>
          {formData.core_values.map((value, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={value}
                onChange={(e) => handleCoreValueChange(index, e.target.value)}
                className="flex-1 p-2 border rounded"
                required
              />
              {formData.core_values.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCoreValue(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCoreValue}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            + Add Core Value
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {isEditing ? "Update About Info" : "Create About Info"}
        </button>
      </form>
    </div>


  )
}

export default UpdateAbout
