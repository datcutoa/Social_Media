import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
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

    const handleAddFriend = (friendId) => {
        setInvitationStatus({ ...invitationStatus, [friendId]: "pending" });
    };

    const handleCancelRequest = (friendId) => {
        setInvitationStatus({ ...invitationStatus, [friendId]: null });
    };

    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p>Đang tải...</p>
        </div>
    );
    if (error) return (
        <div className="error-container">
            <p className="error-text">Lỗi: {error}</p>
        </div>
    );
    if (friends.length === 0) return (
        <div className="no-results-container">
            <p className="no-results-text">Không tìm thấy kết quả nào</p>
        </div>
    );

    return (
        <div className="find-friend-container">
            <div className="search-header">
                <h2>Kết quả tìm kiếm cho: <span className="search-query">{new URLSearchParams(location.search).get("query")}</span></h2>
            </div>

            <div className="tabs-container">
                <button
                    className={`tab-button ${activeTab === "friends" ? "active" : ""}`}
                    onClick={() => setActiveTab("friends")}
                >
                    Bạn bè
                </button>
                <button
                    className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
                    onClick={() => setActiveTab("posts")}
                >
                    Bài viết
                </button>
            </div>

            {activeTab === "friends" && (
                <div className="friend-list-find">
                    {friends
                        .filter(friend => friend.id !== currentUserId)
                        .map(friend => (
                            <div className="friend-card-find" key={friend.id}>
                                <div className="avatar-container-find">
                                    <Link to={`/visitfriend/${friend.id}`}>
                                        <img
                                            src={`/uploads/avatar/${friend.profilePicture || "default_avt.jpg"}`}
                                            alt={friend.name}
                                            className="avatar-find"
                                            onError={(e) => (e.target.src = "/uploads/avatar/default_avt.jpg")}
                                        />
                                    </Link>
                                </div>
                                <div className="friend-info-find">
                                    <Link to={`/visitfriend/${friend.id}`} className="friend-name-link">
                                        <h3 className="friend-name-find">{friend.name || "Không có tên"}</h3>
                                    </Link>
                                    <p className="friend-details-find">
                                        {friend.followers ? `${friend.followers} người theo dõi` : "Không có thông tin"}
                                    </p>
                                </div>
                                <div className="friend-actions-find">
                                    {!invitationStatus[friend.id] ? (
                                        <button
                                            className="add-friend-button-find"
                                            onClick={() => handleAddFriend(friend.id)}
                                        >
                                            Thêm bạn bè
                                        </button>
                                    ) : (
                                        <button
                                            className="cancel-request-button-find"
                                            onClick={() => handleCancelRequest(friend.id)}
                                        >
                                            Hủy lời mời
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            )}

            {activeTab === "posts-find" && (
                <div className="posts-container-find">
                    <p className="no-posts-text-find">Không có bài viết nào để hiển thị.</p>
                </div>
            )}
        </div>
    );
};

export default FindFriend;