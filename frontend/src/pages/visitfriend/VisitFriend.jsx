import "./visitfriend.css";
import SidebarProfile from "../../components/sidebarprofile/SidebarProfile";
import Share from "../../components/share/Share";
import Post from "../../components/post/Post";
import { PhotoCamera } from "@mui/icons-material";
import { useRef, useState, useEffect } from "react";
import FriendList from "../../components/FriendList/FriendList";
import Info from "../../components/info/info";
import { useParams } from "react-router-dom";

export default function Visitfriend() {
    const { id } = useParams(); // Lấy userId từ URL
    const coverFileInputRef = useRef(null);
    const profileFileInputRef = useRef(null);

    const [selectedCoverImage, setSelectedCoverImage] = useState(null);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [activeTab, setActiveTab] = useState("Bài viết");
    const [profileData, setProfileData] = useState({});
    const [posts, setPosts] = useState([]);
    const [isFriend, setIsFriend] = useState(false);

  // Gọi API để lấy thông tin profile khi component mount
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
                setSelectedCoverImage(data.coverPhoto);
                setSelectedProfileImage(data.profilePicture);
                setIsFriend(data.isFriend || false); // Giả sử API trả về trường isFriend
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

  // Hàm gửi yêu cầu kết bạn
  const handleAddFriend = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/friend/request/${id}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to send friend request");
      alert("Đã gửi yêu cầu kết bạn!");
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  // Hàm xử lý nhắn tin (giả lập, bạn cần thêm logic thực tế)
  const handleMessage = () => {
    alert(`Mở hộp thoại nhắn tin với ${profileData.name}`);
    };

  return (
    <div className="profile">
        <div className="profileTop">
            <div className="profileCover">
                <img
                    className="profileCoverImg"
                    src={`/uploads/cover/${selectedCoverImage}`}
                    alt=""
                />
                <img
                    className="profileUserImg"
                    src={`/uploads/avatar/${selectedProfileImage}`}
                    alt=""
                />
                <input
                    type="file"
                    ref={coverFileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                />
                <input
                    type="file"
                    ref={profileFileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                />
            </div>
            <h4 className="profileName">{profileData.name}</h4>

            <div className="profileActions">
                <button className="addFriendButton" onClick={handleAddFriend}>Thêm bạn bè</button>
                <button className="messageButton" onClick={handleMessage}>Nhắn tin</button>
            </div>
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
                        <p>Chưa có bài viết nào.</p>
                        )}
                    </div>
                </>
                    ) : activeTab === "Bạn bè" ? (
                        <div className="profileBottomContainFull">
                        <FriendList />
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