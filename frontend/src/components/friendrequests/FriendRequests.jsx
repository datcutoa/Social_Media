import { Link } from "react-router-dom";
import "./friendRequests.css";

export default function FriendRequests({ isOpen, friendRequests, onClose }) {
    if (!isOpen) return null;

    const handleContainerClick = (e) => {
        e.stopPropagation();
    };
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.id;

    const handleAcceptFriend = async (idFriend) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/friendship/accept?userId=${userId}&friendId=${idFriend}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) throw new Error("Failed to accept friend request");
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi xác nhận yêu cầu kết bạn:", error);
        }
    };
    
    const handleRejectFriend = async (idFriend) => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/friendship/unfriend?userId=${userId}&friendId=${idFriend}`,
                {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) throw new Error("Failed to reject friend request");
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi từ chối yêu cầu kết bạn:", error);
        }
    };
    return (
        <div className="friendRequestsContainer" onClick={handleContainerClick}>
            <div className="friendRequestsHeader">
                <h3>Lời mời kết bạn</h3>
            </div>
            <ul className="friendRequestsList">
                {friendRequests.length === 0 ? (
                <p className="noRequests">Không có lời mời kết bạn</p>
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
                            onClick={(e) =>{ 
                                e.stopPropagation();
                                handleAcceptFriend(user.id);
                            }}>
                            Xác nhận
                        </button>
                        <button className="declineButton" 
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRejectFriend(user.id);
                        }}>
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