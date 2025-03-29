import React, { useState, useEffect } from "react";
import { useLocation, Link} from "react-router-dom";
import "./findfriend.css";

const FindFriend = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invitationStatus, setInvitationStatus] = useState({});
    const [activeTab, setActiveTab] = useState("friends");
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserId = user?.id;
    
    const fetchFriends = async (query) => {
        try {
            const response = await fetch(`http://localhost:8080/api/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error("Không thể tìm kiếm");
            const data = await response.json();
            setFriends(data);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(location.search).get("query");
        if (query) {
            setLoading(true);
            fetchFriends(query);
        } else {
            setLoading(false);
            setError("Không có từ khóa tìm kiếm");
        }
    }, [location]);

    if (loading) return <div className="loading-container"><div className="spinner"></div><p>Đang tải...</p></div>;
    if (error) return <div className="error-container"><p className="error-text">Lỗi: {error}</p></div>;
    if (friends.length === 0) return <div className="no-results-container"><p className="no-results-text">Không tìm thấy kết quả nào</p></div>;

    return (
        <div className="find-friend-container">
            <div className="search-header">
                <h2>Kết quả tìm kiếm cho: <span className="search-query">{new URLSearchParams(location.search).get("query")}</span></h2>
            </div>

            <div className="tabs-container">
                <button className={`tab-button ${activeTab === "friends" ? "active" : ""}`} onClick={() => setActiveTab("friends")}>Bạn bè</button>
                <button className={`tab-button ${activeTab === "posts" ? "active" : ""}`} onClick={() => setActiveTab("posts")}>Bài viết</button>
            </div>

            <div className="friend-list">
                {friends
                    .filter(friend => friend.id !== currentUserId)
                    .map(friend => (
                        <div className="friend-card" key={friend.id}>
                            <div className="avatar-container">
                                <Link to={`/visitfriend/${friend.id}`}>
                                    <img src={`/uploads/avatar/${friend.profilePicture}`} 
                                        alt={friend.name}
                                        className="avatar"
                                    />
                                </Link> 
                            </div>
                            <div className="friend-info">
                                <h3 className="friend-name">{friend.name || "Không có tên"}</h3>
                                <p className="friend-details">{friend.followers ? `${friend.followers} người theo dõi` : "Không có thông tin"}</p>
                            </div>
                            <div className="friend-actions">
                                {!invitationStatus[friend.id] ? (
                                    <button className="add-friend-button" onClick={() => setInvitationStatus({ ...invitationStatus, [friend.id]: "pending" })}>
                                        Thêm bạn bè
                                    </button>
                                ) : (
                                    <button className="cancel-request-button" onClick={() => setInvitationStatus({ ...invitationStatus, [friend.id]: null })}>
                                        Hủy lời mời
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                }
            </div>


            {activeTab === "posts" && (
                <div className="posts-container">
                    <p className="no-posts-text">Không có bài viết nào để hiển thị.</p>
                </div>
            )}
        </div>
    );
};

export default FindFriend;