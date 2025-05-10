import "./share.css";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Videocam, PhotoLibrary, EmojiEmotions, Cancel, Close } from "@mui/icons-material";

export default function Share() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [error, setError] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const id = user.id;
  const [profileData, setProfileData] = useState({});
  const baseUrl = "/uploads/avatar/";

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type.startsWith("image/") || file.type.startsWith("video/"))) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    } else {
      alert("Please select an image or video file!");
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setError("");
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setError("");
    setPostContent("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handlePost = async () => {
    if (!selectedImage && !postContent.trim()) {
      setError("Vui lòng nhập nội dung hoặc thêm ảnh trước khi đăng!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("content", postContent);
      formData.append("privacy", privacy);
      formData.append("userId", id);
      if (selectedImage) {
        formData.append("media", selectedImage);
      }

      const postResponse = await fetch("http://localhost:8080/api/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const contentType = postResponse.headers.get("Content-Type");
      let responseData;

      if (contentType && contentType.includes("application/json")) {
        responseData = await postResponse.json();
      } else {
        responseData = await postResponse.text();
      }

      if (!postResponse.ok) {
        throw new Error(
          typeof responseData === "object" && responseData.message
            ? responseData.message
            : responseData || "Failed to post"
        );
      }

      console.log("Post successful:", responseData);
      setPostContent("");
      setSelectedImage(null);
      setImagePreview(null);
      setIsModalOpen(false);
      setError("");
      window.location.reload();
    } catch (err) {
      console.error("Error posting:", err);
      setError(err.message || "Đã có lỗi xảy ra khi đăng bài!");
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      try {
        const response = await fetch(`http://localhost:8080/api/user/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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

  const username = profileData.name;
  const userId = id || "default-id";
  const profilePicture = `${baseUrl}${profileData.profilePicture}`;

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <Link to={`/profile/${userId}`} className="ProfileLink">
            <img className="shareProfileImg" src={profilePicture} alt="Profile" />
          </Link>
          <input
            placeholder="Bạn đang nghĩ gì thế?"
            className="shareInput"
            onClick={openModal}
            readOnly
          />
        </div>
        <hr />
        <div className="shareOptions">
          <button className="shareOption">
            <Videocam className="shareIcon videoIcon" />
            <span className="shareOptionText">Video trực tiếp</span>
          </button>
          <button className="shareOption" onClick={openModal}>
            <PhotoLibrary className="shareIcon photoIcon" />
            <span className="shareOptionText">Ảnh/Video</span>
          </button>
          <button className="shareOption">
            <EmojiEmotions className="shareIcon emojiIcon" />
            <span className="shareOptionText">Cảm xúc</span>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
              <h3 className="modalHeader-title">Tạo bài viết</h3>
              <button className="modalCloseButton" onClick={closeModal}>
                <Close />
              </button>
            </div>
            <div className="modalContent">
              <div className="modalUser">
                <img className="modalProfileImg" src={profilePicture} alt="Profile" />
                <div>
                  <span className="modalUserName">{username}</span>
                  <select
                    className="modalPrivacySelect"
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value)}
                  >
                    <option value="public">Công khai</option>
                    <option value="friends">Bạn bè</option>
                    <option value="private">Riêng tư</option>
                  </select>
                </div>
              </div>
              <textarea
                placeholder="Bạn đang nghĩ gì thế ?"
                className="modalInput"
                value={postContent}
                onChange={(e) => {
                  setPostContent(e.target.value);
                  setError("");
                }}
              />
              {error && <div className="errorMessage">{error}</div>}
              {imagePreview && (
                <div className="modalImagePreview">
                  <img src={imagePreview} alt="Preview" className="modalPreviewImage" />
                  <button className="modalRemoveImageButton" onClick={removeImage}>
                    <Cancel />
                  </button>
                </div>
              )}
              <div className="modalActions">
                <label htmlFor="fileInputModal" className="modalAddMediaButton">
                  <PhotoLibrary />
                  <span>Thêm ảnh</span>
                </label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  id="fileInputModal"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <button className="modalPostButton" onClick={handlePost}>
                  Đăng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}