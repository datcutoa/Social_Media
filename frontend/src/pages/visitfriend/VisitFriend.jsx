import "./visitfriend.css";
import SidebarProfileFriend from "../../components/sidebarprofilefriend/SidebarProfileFriend";
import Share from "../../components/share/Share";
import Post from "../../components/post/Post";
import { useRef, useState, useEffect } from "react";
import FriendListVisit from "../../components/friendlistvisit/FriendListVisit";
import Info from "../../components/info/info";
import { useParams } from "react-router-dom";

export default function Visitfriend() {
    const { id } = useParams();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;
    const coverFileInputRef = useRef(null);
    const profileFileInputRef = useRef(null);
    const dropdownRef = useRef(null);

    const [selectedCoverImage, setSelectedCoverImage] = useState(null);
    const [selectedProfileImage, setSelectedProfileImage] = useState(null);
    const [activeTab, setActiveTab] = useState("Bài viết");
    const [profileData, setProfileData] = useState({});
    const [posts, setPosts] = useState([]);
    const [isFriend, setIsFriend] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showDropdown]);

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

    const checkFriendStatus = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/friendship/status?userId=${userId}&friendId=${id}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("Failed to check friendship status");
            const data = await response.json();
            // Đảm bảo nhận diện chính xác trạng thái từ cả hai chiều
            setIsFriend(data.status); // Thay đổi cho phù hợp nếu cần
        } catch (error) {
            console.error("Error checking friendship status:", error);
        }
    };

    checkFriendStatus();
    fetchProfile();
    fetchPosts();
}, [userId, id]);

    // Hàm gửi yêu cầu kết bạn
    const handleAddFriend = async () => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?.id;
        try {
        const response = await fetch(
            `http://localhost:8080/api/friendship/send-request?userId=${userId}&friendId=${id}`, // ✅ Đúng format
            {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            }
        );
    
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to send friend request: ${errorData.error}`);
        }
        window.location.reload();
        } catch (error) {
        console.error("Lỗi khi gửi yêu cầu kết bạn:", error);
        }
    };
    const handleUnfriend = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/friendship/unfriend?userId=${userId}&friendId=${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Failed to unfriend");
            }
            setShowDropdown(false);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi hủy kết bạn:", error);
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
                    {isFriend === "DANG_CHO" ? (
                        <button className="cancelFriendRequestButton" onClick={handleUnfriend}>
                            Hủy lời mời
                        </button>
                    ) : isFriend === "DA_KET_BAN" ? (
                        <button className="friendButton" onClick={() => setShowDropdown(!showDropdown)}>
                            Bạn bè
                        </button>
                    ) : (
                        <button className="addFriendButton" onClick={handleAddFriend}>
                            Thêm bạn bè
                        </button>
                    )}
                    <button className="messageButton" onClick={handleMessage}>Nhắn tin</button>
                    {showDropdown && (
                        <div className="dropdownMenu" ref={dropdownRef}>
                            <button className="unfriendButton" onClick={handleUnfriend}>
                                Hủy kết bạn
                            </button>
                        </div>
                    )}
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
                            <SidebarProfileFriend setActiveTab={setActiveTab} />
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
                            <FriendListVisit />
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