import React, { useEffect, useState } from "react";
import "./FriendList.css";

const FriendList = ({ userId }) => {
    const [activeTab, setActiveTab] = useState("friends");
    const [searchTerm, setSearchTerm] = useState("");
    const [showRemove, setShowRemove] = useState(null);
    const [sentFriendRequests, setSentFriendRequests] = useState([]);
    const [receiveFriendRequests, setReceiveFriendRequests] = useState([]);
    const [listFriendRequests, setListFriendRequests] = useState([]);
    const [friendsOfFriends, setFriendsOfFriends] = useState([]);

    useEffect(() => {
        const fetchSentFriendRequests = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/friendship/pending/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });
    
                if (!response.ok) throw new Error("Failed to fetch sent friend requests");
    
                const data = await response.json();

                setSentFriendRequests(data.map(req => ({
                    id: req.id,
                    name: req.name,
                    image: req.profilePicture ? `/uploads/avatar/${req.profilePicture}` : "default-avatar.png"
                })));
            } catch (error) {
                console.error("Error fetching sent friend requests:", error);
            }
        };

        const fetchReceiveFriendRequests = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/friendship/received/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });
    
                if (!response.ok) throw new Error("Failed to fetch sent friend requests");
    
                const data = await response.json();

                setReceiveFriendRequests(data.map(req => ({
                    id: req.id,
                    name: req.name,
                    image: req.profilePicture ? `/uploads/avatar/${req.profilePicture}` : "default-avatar.png"
                })));
            } catch (error) {
                console.error("Error fetching sent friend requests:", error);
            }
        };

        const fetchListFriendRequests = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/friendship/friends/${userId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });
    
                if (!response.ok) throw new Error("Failed to fetch sent friend requests");
    
                const data = await response.json();
                console.log(data);
                setListFriendRequests(data.map(req => ({
                    id: req.id,
                    name: req.name,
                    image:`/uploads/avatar/${req.profilePicture}`
                })));
            } catch (error) {
                console.error("Error fetching sent friend requests:", error);
            }
        };

        fetchListFriendRequests();
        fetchReceiveFriendRequests();
        fetchSentFriendRequests();
    }, [userId]);
    
    const handleAcceptFriendRequest = async (friendId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/friendship/accept?userId=${userId}&friendId=${friendId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                }
            });
    
            if (response.ok) {
                setReceiveFriendRequests((prevRequests) =>
                    prevRequests.filter((req) => req.id !== friendId)
                );
            } else {
                alert("Lỗi khi chấp nhận lời mời kết bạn!");
            }
        } catch (error) {
            console.error("Error accepting friend request:", error);
        }
    };

    // Xác định danh sách hiển thị
    const getDisplayedList = () => {
        let list = [];
        if (activeTab === "friends") list = listFriendRequests;
        if (activeTab === "sent") list = sentFriendRequests;
        if (activeTab === "received") list = receiveFriendRequests;
        return list.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    };
    const displayedList = getDisplayedList();

    return (
        <div className="friend-list-container">
            {/* Header */}
            <div className="friend-list-header">
                <h2>Danh sách bạn bè</h2>
                <div className="friend-list-actions">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm bạn bè..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="action-btn">+ Thêm bạn</button>
                </div>
            </div>

            {/* Tabs */}
            <div className="friend-list-tabs">
                <button
                    className={activeTab === "friends" ? "active" : ""}
                    onClick={() => setActiveTab("friends")}
                >
                    Tất cả bạn bè
                </button>
                <button
                    className={activeTab === "sent" ? "active" : ""}
                    onClick={() => setActiveTab("sent")}
                >
                    Đã gửi
                </button>
                <button
                    className={activeTab === "received" ? "active" : ""}
                    onClick={() => setActiveTab("received")}
                >
                    Đã nhận
                </button>
            </div>

            {/* Danh sách bạn bè / lời mời */}
            <div className="friend-list-grid">
                {displayedList.length === 0 ? (
                    <p className="no-friends-message">Chưa có</p>
                ) :(
                    getDisplayedList().map((friend) => (
                        <div key={friend.id} className="friend-card">
                            <img src={friend.image} alt="" className="friend-image" />
                            <div className="friend-info">
                                <h4 className="friend-name">{friend.name}</h4>
                                {activeTab === "friends" && <p className="friend-mutual">{friend.mutualFriends} bạn chung</p>}
                            </div>
                            <div className="friend-actions">
                                {activeTab === "friends" && (
                                    <>
                                        <span className="action-dots" onClick={() => setShowRemove(friend.id === showRemove ? null : friend.id)}>⋮</span>
                                        {showRemove === friend.id && (
                                            <button className="remove-btn">Xóa bạn</button>
                                        )}
                                    </>
                                )}
                                {activeTab === "received" && (
                                    <div className="friend-actions">
                                        <button className="accept-btn" onClick={() => handleAcceptFriendRequest(friend.id)}>Chấp nhận</button>
                                        <button className="decline-btn">Từ chối</button>
                                    </div>
                                )}
                                {activeTab === "sent" && (
                                    <button className="cancel-btn">Hủy yêu cầu</button>
                                )}
                            </div>
                        </div>
                    )))
                }
            </div>
        </div>
    );
};
export default FriendList;