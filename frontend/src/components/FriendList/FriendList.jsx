import React, { useState, useEffect, useRef } from "react";
import "./FriendList.css";

const FriendList = () => {
    const [friends, setFriends] = useState([
        { id: 1, name: "Trần Nguyễn Anh Duy", mutualFriends: 83, image: "asset/person/1.jpeg" },
        { id: 2, name: "Tạ Nguyễn", mutualFriends: 86, image: "asset/person/2.jpeg" },
        { id: 3, name: "Nguyễn Ngọc Anh", mutualFriends: 50, image: "asset/person/3.jpeg" },
        { id: 4, name: "Kim Ngân", mutualFriends: 72, image: "asset/person/4.jpeg" },
        { id: 5, name: "Quách Ngọc Anh Thu", mutualFriends: 24, image: "asset/person/5.jpeg" },
        { id: 6, name: "Nguyễn Huỳnh Đạt", mutualFriends: 48, image: "asset/person/6.jpeg" },
        // Loại bỏ các mục trùng lặp để dữ liệu mẫu sạch hơn
        { id: 7, name: "Lê Minh", mutualFriends: 30, image: "asset/person/7.jpeg" },
        { id: 8, name: "Phạm Hương", mutualFriends: 65, image: "asset/person/8.jpeg" },
        { id: 9, name: "Trần Quang", mutualFriends: 12, image: "asset/person/9.jpeg" },
        { id: 10, name: "Hoàng Anh", mutualFriends: 90, image: "asset/person/10.jpeg" },
    ]);

    const [filter] = useState("all"); // Chưa dùng filter, giữ nguyên để mở rộng sau
    const [showMenu, setShowMenu] = useState({});
    const menuRefs = useRef({}); // Ref để theo dõi từng menu

    // Hàm xử lý hiển thị menu dropdown
    const handleToggleMenu = (friendId) => {
        setShowMenu((prev) => ({
            ...prev,
            [friendId]: !prev[friendId],
        }));
    };

    // Hàm xử lý gỡ bạn bè
    const handleRemoveFriend = (friendId) => {
        setFriends((prevFriends) => prevFriends.filter((friend) => friend.id !== friendId));
        setShowMenu((prev) => ({ ...prev, [friendId]: false }));
    };

    // Xử lý click ngoài để đóng menu
    useEffect(() => {
        const handleClickOutside = (e) => {
            const isOutside = Object.keys(showMenu).every((friendId) => {
                const menuRef = menuRefs.current[friendId];
                return (
                    menuRef &&
                    !menuRef.contains(e.target) &&
                    !e.target.classList.contains("action-dots")
                );
            });

            if (isOutside) {
                setShowMenu({});
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showMenu]); // Thêm showMenu vào dependency để cập nhật khi menu thay đổi

    return (
        <div className="friend-list-container">
            <div className="friend-list-header">
                <h2>Bạn bè</h2>
                <div className="friend-list-actions">
                    <input type="text" placeholder="Tìm kiếm" className="search-input" />
                    <button className="action-btn">Lọc mẫu kết bạn</button>
                </div>
            </div>
            <div className="friend-list-grid">
                {friends.map((friend) => (
                    <div key={friend.id} className="friend-card">
                        <img
                            src={friend.image || "https://via.placeholder.com/60"}
                            alt={friend.name}
                            className="friend-image"
                        />
                        <div className="friend-info">
                            <h4 className="friend-name">{friend.name}</h4>
                            <p className="friend-mutual">{friend.mutualFriends} bạn chung</p>
                        </div>
                        <div className="friend-actions">
                            <span
                                className="action-dots"
                                onClick={() => handleToggleMenu(friend.id)}
                            >
                                ...
                            </span>
                            {showMenu[friend.id] && (
                                <div
                                    ref={(el) => (menuRefs.current[friend.id] = el)}
                                    className="dropdown-menu"
                                >
                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemoveFriend(friend.id)}
                                    >
                                        Gỡ bạn
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FriendList;