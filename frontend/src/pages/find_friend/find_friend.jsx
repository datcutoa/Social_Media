import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./find_friend.css";
import { colors } from "@mui/material";

const FriendList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

  // Hàm gọi API để tìm kiếm
    const fetchFriends = async (query) => {
        try {
            const response = await fetch(`http://localhost:8080/api/search?query=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                // Nếu cần token:
                // "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) {
                throw new Error("Không thể tìm kiếm");
            }

            const data = await response.json();
            setFriends(data);
            setLoading(false);
            setError(null);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

  // Lấy query parameter và gọi API khi component mount hoặc location thay đổi
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

    // Xử lý trạng thái loading và error
    if (loading) {
        return <div className="friend-list">Đang tải...</div>;
    }

    if (error) {
        return (
        <div className="friend-list">
            <div className="error-message">
            <p>Lỗi: {error}</p>
            <button onClick={() => fetchFriends(new URLSearchParams(location.search).get("query"))}>
                Thử lại
            </button>
            </div>
        </div>
        );
    }

    if (friends.length === 0) {
        return <div className="friend-list">Không tìm thấy kết quả nào.</div>;
    }

    return (
        <div className="friend-list">
            <h2>Kết quả tìm kiếm cho: <span style={{ color:"red" }}>{new URLSearchParams(location.search).get("query")}</span></h2>        
                {friends.map((friend) => (
                    <div className="friend-card" key={friend.id || Math.random()}>
                    <img
                        src={friend.avatar || "https://via.placeholder.com/50"}
                        alt={friend.name || "Avatar"}
                        className="friend-avatar"
            />
            <div className="friend-info">
                <h3 className="friend-name">{friend.name || "Không có tên"}</h3>
                {friend.username && <p className="friend-username">{friend.username}</p>}
                {friend.description && <p className="friend-description">{friend.description}</p>}
                {friend.followers && <p className="friend-followers">{friend.followers}</p>}
                <p className="friend-mutual">{friend.mutualFriends || "0 bạn chung"}</p>
            </div>
            <button className="add-friend-btn">Thêm bạn bè</button>
            </div>
        ))}
        </div>
    );
};
export default FriendList;