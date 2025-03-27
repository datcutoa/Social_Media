import { useState, useEffect } from "react";
import "./info.css";
import { Person, Email, Wc, Cake, Edit } from "@mui/icons-material";

export default function SidebarProfile({ setActiveTab }) {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const id = user.id;

  const [profileData, setProfileData] = useState({});
  const [editingField, setEditingField] = useState(null); // Track which field is being edited
  const [editValue, setEditValue] = useState(""); // Store the value being edited

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:8080/api/user/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [id]);

  // Extract data from profileData or use fallbacks
  const name = profileData.name || "Chưa cập nhật";
  const email = profileData.email || "Chưa cập nhật";
  const gender = profileData.gender || "Chưa cập nhật";
  const birthdate = profileData.birthdate || "Chưa cập nhật";

  // Start editing a field
  const handleEditClick = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue === "Chưa cập nhật" ? "" : currentValue);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingField(null);
    setEditValue("");
  };

  // Save the edited value to the backend
  const handleSave = async (field) => {
    try {
      const updatedData = { [field]: editValue };
      const response = await fetch(`http://localhost:8080/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedProfile = await response.json();
      setProfileData(updatedProfile); // Update the local state with the new data
      setEditingField(null); // Close the edit form
      setEditValue("");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Lỗi khi cập nhật thông tin! Vui lòng thử lại.");
    }
  };

  // Render a field with an edit icon and optional edit form
  const renderField = (label, value, field, icon) => (
    <>
      <li className="sidebarProfileListItem">
        {icon}
        <span className="sidebarProfileText">{label}: {value}</span>
        <Edit
          className="sidebarProfileEditIcon"
          onClick={() => handleEditClick(field, value)}
        />
      </li>
      {editingField === field && (
        <div className="editForm">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="editInput"
            placeholder={`Nhập ${label.toLowerCase()}`}
          />
          <div className="editButtons">
            <button
              className="editButton saveButton"
              onClick={() => handleSave(field)}
            >
              Lưu
            </button>
            <button
              className="editButton cancelButton"
              onClick={handleCancel}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="sidebarProfile">
      <div className="sidebarProfileWrapper">
        <h3 className="sidebarProfileTitle">Giới thiệu</h3>
        <ul className="sidebarProfileList">
          {renderField("Tên", name, "name", <Person className="sidebarProfileIcon" />)}
          {renderField("Email", email, "email", <Email className="sidebarProfileIcon" />)}
          {renderField("Giới tính", gender, "gender", <Wc className="sidebarProfileIcon" />)}
          {renderField("Ngày sinh", birthdate, "birthdate", <Cake className="sidebarProfileIcon" />)}
        </ul>
      </div>
    </div>
  );
}