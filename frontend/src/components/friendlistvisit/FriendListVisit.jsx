import React, { useEffect, useState } from "react";
import "./friendlistvisit.css";
import { useParams, Link } from "react-router-dom";

const FriendListVisit = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [friends, setFriends] = useState([]);
    const { id } = useParams();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = storedUser?.id;

    useEffect(() => {
        const fetchFriendsList = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/friendship/friends/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch friends list");
                const data = await response.json();
                setFriends(data.map(friend => ({
                    id: friend.id,
                    name: friend.name,
                    image: `/uploads/avatar/${friend.profilePicture}`,
                    mutualFriends: friend.mutualFriends || 0,
                })));
            } catch (error) {
                console.error("Error fetching friends list:", error);
            }
        };
        fetchFriendsList();
    }, [id]);

    const getDisplayedList = () => {
        return friends.filter((f) => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
                    <button className="action-btn">Tìm kiếm</button>
                </div>
            </div>

            {/* Danh sách bạn bè */}
            <div className="friend-list-grid">
                {displayedList.length === 0 ? (
                    <p className="no-friends-message">Chưa có bạn bè</p>
                ) : (
                    displayedList.map((friend) => (
                        <div key={friend.id} className="friend-card">
                            <Link style={{ textDecoration: "none" }} to={friend.id === currentUserId ? `/profile/${currentUserId}` : `/visitfriend/${friend.id}`}>
                                <img src={friend.image} alt={friend.name} className="friend-image" />
                                <div className="friend-info">
                                    <h4 className="friend-name">{friend.name}</h4>
                                    <p className="friend-mutual">{friend.mutualFriends} bạn chung</p> {/* Show mutual friends count */}
                                </div>
                            </Link>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FriendListVisit;