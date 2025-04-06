import "./profile.css";
import SidebarProfile from "../../components/sidebarprofile/SidebarProfile";
import Share from "../../components/share/Share";
import Post from "../../components/post/Post";
import { PhotoCamera } from "@mui/icons-material";
import { useRef, useState, useEffect } from "react";
import FriendList from "../../components/FriendList/FriendList";
import Info from "../../components/info/info";
import { useParams } from "react-router-dom";
import imageCompression from "browser-image-compression";

export default function Profile() {
  const { id } = useParams();
  const coverFileInputRef = useRef(null);
  const profileFileInputRef = useRef(null);

  const [selectedCoverImage, setSelectedCoverImage] = useState(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [isCoverImageSelected, setIsCoverImageSelected] = useState(false);
  const [isProfileImageSelected, setIsProfileImageSelected] = useState(false);
  const [activeTab, setActiveTab] = useState("Bài viết");
  const [profileData, setProfileData] = useState({});
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
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
        setSelectedCoverImage(data.coverPhoto ? `/uploads/cover/${data.coverPhoto}` : null);
        setSelectedProfileImage(data.profilePicture ? `/uploads/avatar/${data.profilePicture}` : null);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/posts/user/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchProfile();
    fetchPosts();
  }, [id]);

  const handleCoverClick = () => {
    if (!isCoverImageSelected) {
      coverFileInputRef.current.click();
    } else {
      saveCoverImage();
    }
  };

  const handleCameraClick = () => {
    if (!isProfileImageSelected) {
      profileFileInputRef.current.click();
    } else {
      saveProfileImage();
    }
  };

  const handleCoverFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedCoverImage(imageUrl);
      setIsCoverImageSelected(true);
      console.log("Cover file selected:", file, "Temp URL:", imageUrl);
    }
  };

  const handleProfileFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedProfileImage(imageUrl);
      setIsProfileImageSelected(true);
      console.log("Profile file selected:", file, "Temp URL:", imageUrl);
    }
  };

  const saveCoverImage = async () => {
    try {
      const file = coverFileInputRef.current.files[0];
      if (!file) {
        console.error("No cover image selected");
        return;
      }
  
      // Nén ảnh trước khi gửi
      const options = {
        maxSizeMB: 1, // Giới hạn kích thước tối đa là 1MB
        maxWidthOrHeight: 1920, // Giới hạn chiều rộng/cao tối đa
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      console.log("Original size:", file.size / 1024 / 1024, "MB");
      console.log("Compressed size:", compressedFile.size / 1024 / 1024, "MB");
  
      const formData = new FormData();
      formData.append("coverImage", compressedFile);
  
      const response = await fetch(`http://localhost:8080/api/user/${id}/coverphoto`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save cover image: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      setSelectedCoverImage(`/uploads/cover/${data.coverPhoto}`);
      setIsCoverImageSelected(false);
      console.log("Cover image saved:", data);
    } catch (error) {
      console.error("Error saving cover image:", error);
    }
  };

  const saveProfileImage = async () => {
    try {
      const file = profileFileInputRef.current.files[0];
      if (!file) {
        console.error("No profile image selected");
        return;
      }
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`http://localhost:8080/api/user/${id}/avatar`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save profile image");
      const data = await response.json();
      setSelectedProfileImage(`/uploads/avatar/${data.profilePicture}`);
      setIsProfileImageSelected(false);
      console.log("Profile image saved:", data);
    } catch (error) {
      console.error("Error saving profile image:", error);
    }
  };

  return (
    <div className="profile">
      <div className="profileTop">
        <div className="profileCover">
          <img
            className="profileCoverImg"
            src={selectedCoverImage || "/default-cover.jpg"}
            alt=""
          />
          <button className="changeCoverBtn" onClick={handleCoverClick}>
            {isCoverImageSelected ? "Lưu" : <PhotoCamera />}
          </button>
          <img
            className="profileUserImg"
            src={selectedProfileImage || "/default-avatar.jpg"}
            alt=""
          />
          <button className="cameraIcon" onClick={handleCameraClick}>
            {isProfileImageSelected ? "Lưu" : <PhotoCamera />}
          </button>
          <input
            type="file"
            ref={coverFileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleCoverFileChange}
          />
          <input
            type="file"
            ref={profileFileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleProfileFileChange}
          />
        </div>
        <h4 className="profileName">{profileData.name}</h4>
        <div className="menuItem">
          <ul>
            <li
              className={activeTab === "Bài viết" ? "active" : ""}
              onClick={() => setActiveTab("Bài viết")}
            >
              Bài viết
            </li>
            <li
              className={activeTab === "Bạn bè" ? "active" : ""}
              onClick={() => setActiveTab("Bạn bè")}
            >
              Bạn bè
            </li>
            <li
              className={activeTab === "Thông tin cá nhân" ? "active" : ""}
              onClick={() => setActiveTab("Thông tin cá nhân")}
            >
              Thông tin cá nhân
            </li>
          </ul>
        </div>
      </div>
      <div className="profileBottom">
        <div className="profileBottomContain">
          {activeTab === "Bài viết" ? (
            <>
              <div className="profileBottomContainLeft">
                <SidebarProfile setActiveTab={setActiveTab} />
              </div>
              <div className="profileBottomContainRight">
                <Share />
                {posts.length > 0 ? (
                  posts.map((post) => <Post key={post.id} post={post} />)
                ) : (
                  <p className="noPost">Chưa có bài viết nào.</p>
                )}
              </div>
            </>
          ) : activeTab === "Bạn bè" ? (
            <div className="profileBottomContainFull">
              <FriendList userId={id} />
            </div>
          ) : (
            <div className="profileBottomContainFull">
              <Info />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}