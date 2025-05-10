import "./sidebarprofilefriend.css";
import { useState, useEffect } from "react";
import { useParams, Link} from "react-router-dom";

export default function SidebarProfileFriend({ setActiveTab}) {  
    const [bio, setBio] = useState("");
    const [tempBio, setTempBio] = useState("");
    const [friends,setFriends] = useState([]);
    const { id } = useParams();
    const storedUser = JSON.parse(localStorage.getItem("user")); // Chuyển chuỗi JSON thành object
    const currentUserId = storedUser?.id;

    useEffect(() => {
        const fetchBio = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/user/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            });
            if (!response.ok) throw new Error("Failed to fetch profile");
            const data = await response.json();
            setBio(data.bio || "");
            setTempBio(data.bio || "");
        } catch (error) {
            console.error("Error fetching bio:", error);
            setBio("");
            setTempBio("");
        }
        };

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
            })));
        } catch (error) {
            console.error("Error fetching friends list:", error);
        }
    };
        fetchFriendsList();
        fetchBio();
    }, [id]);

    return (
        <div className="SidebarProfile">
            <div className="SidebarProfileTop">
                <h3>Giới thiệu</h3>
                {bio ? (
                    <div className="bioEditContainer">
                    <textarea
                        className="bioTextarea"
                        value={tempBio}
                        placeholder="Mô tả về bạn..."
                    />
                    </div>
                ) : (
                    <div className="noBioMessage">Chưa có thông tin giới thiệu</div>
                )}
            </div>

            <div className="SidebarProfileBottom">
                <div className="friendsHeader">
                    <h4>Bạn bè</h4>
                    <button
                        className="seeAllFriends"
                        onClick={() => setActiveTab("Bạn bè")}
                    >
                        Xem tất cả bạn bè
                    </button>
                </div>
                <div className="friendsCount">{friends.length} người bạn</div>
                <div className="friendsList">
                    {friends.map((friend, index) => (
                        <Link style={{ textDecoration: "none" }}
                            key={friend.id}
                            to={friend.id === currentUserId ? `/profile/${currentUserId}` : `/visitfriend/${friend.id}`}
                            >
                            <div className="friendItem">
                                <div className="friendImageWrapper">
                                <img src={friend.image} className="friendImage" alt={friend.name} />
                                </div>
                                <div className="friendInfo">
                                    <span className="friendName">{friend.name}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}