import "./friendRequests.css";

export default function FriendRequests({ isOpen, onClose }) {
    if (!isOpen) return null;

    // Danh sách lời mời (có ảnh đại diện)
    const friendRequests = [
        { id: 1, name: "Người dùng A", avatar: "/assets/person/1.jpeg" },
        { id: 2, name: "Người dùng B", avatar: "/assets/person/2.jpeg" },
    ];

    return (
        <div className="friendRequestsContainer">
            <div className="friendRequestsHeader">
                <h3>Lời mời kết bạn</h3>
                <button onClick={onClose} className="closeButton">X</button>
            </div>
            <ul className="friendRequestsList">
                {friendRequests.map((user) => (
                    <li key={user.id} className="friendRequestItem">
                        <img src={user.avatar} alt={user.name} className="friendAvatar" />
                        <span className="friendName">{user.name}</span>
                        <div className="friendActions">
                            <button className="acceptButton">Xác nhận</button>
                            <button className="declineButton">Hủy</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
