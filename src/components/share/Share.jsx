import "./share.css";
import { useState } from "react";
import { Theaters, Label, Room, EmojiEmotions, Cancel } from "@mui/icons-material";

export default function Share() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src="/asset/person/1.jpeg" alt="Profile" />
          <input placeholder="What's on your mind?" className="shareInput" />
        </div>
        <hr className="shareHr" />

        {/* Hiển thị ảnh được chọn với nút xóa */}
        {selectedImage && (
          <div className="shareImagePreview">
            <img src={selectedImage} alt="Selected" className="previewImage" />
            <button className="removeImageButton" onClick={removeImage}>
              <Cancel className="removeImageIcon" />
            </button>
          </div>
        )}

        <div className="shareBottom">
          <div className="shareOptions">
            <label htmlFor="fileInput" className="shareOption">
              <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <Theaters htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo/Video</span>
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton">Post</button>
        </div>
      </div>
    </div>
  );
}