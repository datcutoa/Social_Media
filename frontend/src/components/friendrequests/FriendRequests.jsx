import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./friendRequests.css";

export default function FriendRequests({ isOpen, userId, onClose }) {
    const [friendRequests, setFriendRequests] = useState([]);
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = storedUser?.id;

    useEffect(() => {
        const fetchReceiveFriendRequests = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/friendship/received/${currentUserId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch received friend requests");
                }

                const data = await response.json();

                const formattedData = Array.isArray(data) ? data.map(req => ({
                    id: req.id,
                    name: req.name,
                    image: req.profilePicture ? `/uploads/avatar/${req.profilePicture}` : "default-avatar.png"
                })) : [];

                setFriendRequests(formattedData);
            } catch (error) {
                console.error("Error fetching received friend requests:", error);
                setFriendRequests([]);
            }
        };

        if (currentUserId) {
            fetchReceiveFriendRequests();
        }
    }, [currentUserId]);

    if (!isOpen) return null;

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };

    const handleAcceptFriendRequest = async (friendId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/friendship/accept?userId=${currentUserId}&friendId=${friendId}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.ok) {
                setFriendRequests((prevRequests) =>
                    prevRequests.filter((req) => req.id !== friendId)
                );
            } else {
                const errorText = await response.text();
                alert(`Lỗi khi chấp nhận lời mời kết bạn: ${errorText}`);
            }
        } catch (error) {
            console.error("Error accepting friend request:", error);
            alert("Có lỗi xảy ra khi chấp nhận lời mời!");
        }
    };

    return (
        <div className="friendRequestsContainer" onClick={handleContainerClick}>
        <div className="friendRequestsHeader">
            <h3>Lời mời kết bạn</h3>
        </div>
        <ul className="friendRequestsList">
            {friendRequests.length === 0 ? (
            <li className="friendRequestItem" style={{ color: "black" }}>Không có lời mời kết bạn</li>
            ) : (
            friendRequests.map((user) => (
                <li key={user.id} className="friendRequestItem">
                <Link to={`/visitfriend/${user.id}`} className="friendAvatarLink">
                    <img src={user.image} alt={user.name} className="friendAvatar" />
                </Link>
                <Link to={`/visitfriend/${user.id}`} className="friendNameLink">
                    <span className="friendName">{user.name}</span>
                </Link>
                <div className="friendActions">
                    <button className="acceptButton"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleAcceptFriendRequest(user.id)}
                    }>
                        Xác nhận
                    </button>
                    <button className="declineButton" onClick={(e) => e.stopPropagation()}>
                    Hủy
                    </button>
                </div>
                </li>
            ))
            )}
        </ul>
        </div>
    );
}