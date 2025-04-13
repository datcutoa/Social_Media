import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./FriendList.css";

const FriendList = ({ userId }) => {
    console.log(userId);
    const [activeTab, setActiveTab] = useState("friends");
    const [searchTerm, setSearchTerm] = useState("");
    const [showRemove, setShowRemove] = useState(null);
    const [sentFriendRequests, setSentFriendRequests] = useState([]);
    const [receiveFriendRequests, setReceiveFriendRequests] = useState([]);
    const [listFriendRequests, setListFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [sentRes, receivedRes, friendsRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/friendship/pending/${userId}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }),
                    fetch(`http://localhost:8080/api/friendship/received/${userId}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }),
                    fetch(`http://localhost:8080/api/friendship/friends/${userId}`, {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json",
                        },
                    }),
                ]);

                if (!sentRes.ok || !receivedRes.ok || !friendsRes.ok) {
                    throw new Error("Failed to fetch data");
                }

                const [sentData, receivedData, friendsData] = await Promise.all([
                    sentRes.json(),
                    receivedRes.json(),
                    friendsRes.json(),
                ]);

                setSentFriendRequests(sentData.map(req => ({
                    id: req.id,
                    name: req.name,
                    image: req.profilePicture ? `/uploads/avatar/${req.profilePicture}` : "default-avatar.png",
                })));
                setReceiveFriendRequests(receivedData.map(req => ({
                    id: req.id,
                    name: req.name,
                    image: req.profilePicture ? `/uploads/avatar/${req.profilePicture}` : "default-avatar.png",
                })));
                setListFriendRequests(friendsData.map(req => ({
                    id: req.id,
                    name: req.name,
                    image: req.profilePicture ? `/uploads/avatar/${req.profilePicture}` : "default-avatar.png",
                })));
            } catch (error) {
                console.error("Error fetching friend data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    const handleAcceptFriendRequest = async (friendId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/friendship/accept?userId=${userId}&friendId=${friendId}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                setReceiveFriendRequests(prev => prev.filter(req => req.id !== friendId));
            } else {
                alert("Lỗi khi chấp nhận lời mời kết bạn!");
            }
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    // const handleCancelFriendRequest = async (friendId) => {
    //     try {
    //         const response = await fetch(
    //             `http://localhost:8080/api/friendship/cancel?userId=${userId}&friendId=${friendId}`,
    //             {
    //                 method: "DELETE",
    //                 headers: {
    //                     "Authorization": `Bearer ${localStorage.getItem("token")}`,
    //                     "Content-Type": "application/json",
    //                 },
    //             }
    //         );

    //         if (response.ok) {
    //             setSentFriendRequests(prev => prev.filter(req => req.id !== friendId));
    //         } else {
    //             alert("Lỗi khi hủy yêu cầu kết bạn!");
    //         }
    //     } catch (error) {
    //         console.error("Error canceling friend request:", error);
    //     }
    // };

    const handleUnfriend = async (id) => {
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
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi hủy kết bạn:", error);
        }
    };

    const getDisplayedList = () => {
        const list = activeTab === "friends" ? listFriendRequests :
                    activeTab === "sent" ? sentFriendRequests :
                    receiveFriendRequests;
        return list.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    return (
        <div className="friend-container">
            <div className="friend-header">
                <h2>Danh sách bạn bè</h2>
                <div className="friend-actions">
                    <input
                        type="text"
                        className="search-bar"
                        placeholder="Tìm kiếm bạn bè..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="friend-tabs">
                {["friends", "sent", "received"].map(tab => (
                    <button
                        key={tab}
                        className={activeTab === tab ? "active" : ""}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab === "friends" ? "Tất cả bạn bè" : tab === "sent" ? "Đã gửi" : "Đã nhận"}
                    </button>
                ))}
            </div>

            <div className="friend-grid">
                {loading ? (
                    <p className="loading-text">Đang tải...</p>
                ) : getDisplayedList().length === 0 ? (
                    <p className="no-friends-text">Chưa có</p>
                ) : (
                    getDisplayedList().map(friend => (
                        <div key={friend.id} className="friend-item">
                            <Link to={`/visitfriend/${friend.id}`} className="profile-link">
                                <img src={friend.image} alt="" className="friend-avatar" />
                            </Link>
                            <div className="friend-details">
                                <Link to={`/visitfriend/${friend.id}`} className="profile-link">
                                    <h4 className="friend-username">{friend.name}</h4>
                                </Link>
                                {activeTab === "friends" && (
                                    <p className="friend-mutual-count">{friend.mutualFriends || 0} bạn chung</p>
                                )}
                            </div>
                            <div className="friend-options">
                                {activeTab === "friends" && (
                                    <>
                                        <span
                                            className="options-icon"
                                            onClick={() => setShowRemove(friend.id === showRemove ? null : friend.id)}
                                        >
                                            ⋮
                                        </span>
                                        {showRemove === friend.id && (
                                            <button className="remove-friend-btn">Xóa bạn</button>
                                        )}
                                    </>
                                )}
                                {activeTab === "received" && (
                                    <div className="friend-options-buttons">
                                        <button
                                            className="accept-btn"
                                            onClick={() => handleAcceptFriendRequest(friend.id)}
                                        >
                                            Chấp nhận
                                        </button>
                                        <button className="decline-btn">Từ chối</button>
                                    </div>
                                )}
                                {activeTab === "sent" && (
                                    <button
                                        className="cancel-btn"
                                        onClick={() =>handleUnfriend(friend.id)}
                                    >
                                        Hủy yêu cầu
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FriendList;